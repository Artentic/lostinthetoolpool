package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/model"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)

type ProjectService struct {
	neo4j *database.Neo4jClient
	redis *database.RedisClient
}

func NewProjectService(neo4j *database.Neo4jClient, redis *database.RedisClient) *ProjectService {
	return &ProjectService{neo4j: neo4j, redis: redis}
}

func (s *ProjectService) List(ctx context.Context) ([]model.Project, error) {
	cacheKey := "projects:all"
	if cached, err := s.redis.Client().Get(ctx, cacheKey).Bytes(); err == nil {
		var projects []model.Project
		if json.Unmarshal(cached, &projects) == nil {
			return projects, nil
		}
	}

	session := s.neo4j.ReadSession(ctx)
	defer session.Close(ctx)

	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		records, err := tx.Run(ctx, `
			MATCH (p:Project)
			RETURN p.slug AS slug, p.name AS name, p.description AS description,
			       p.difficulty AS difficulty, p.time_estimate AS time_estimate
			ORDER BY p.difficulty ASC, p.name ASC
		`, nil)
		if err != nil {
			return nil, err
		}

		var projects []model.Project
		for records.Next(ctx) {
			r := records.Record()
			projects = append(projects, model.Project{
				Slug:         getString(r, "slug"),
				Name:         getString(r, "name"),
				Description:  getString(r, "description"),
				Difficulty:   getInt(r, "difficulty"),
				TimeEstimate: getString(r, "time_estimate"),
			})
		}
		return projects, nil
	})
	if err != nil {
		return nil, fmt.Errorf("list projects: %w", err)
	}

	projects := result.([]model.Project)
	if data, err := json.Marshal(projects); err == nil {
		s.redis.Client().Set(ctx, cacheKey, data, 1*time.Hour)
	}

	return projects, nil
}

func (s *ProjectService) GetBySlug(ctx context.Context, slug string) (*model.Project, error) {
	cacheKey := "project:" + slug
	if cached, err := s.redis.Client().Get(ctx, cacheKey).Bytes(); err == nil {
		var p model.Project
		if json.Unmarshal(cached, &p) == nil {
			return &p, nil
		}
	}

	session := s.neo4j.ReadSession(ctx)
	defer session.Close(ctx)

	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		record, err := tx.Run(ctx, `
			MATCH (p:Project {slug: $slug})
			OPTIONAL MATCH (p)-[:RELATED_TO]-(related:Project)
			RETURN p.slug AS slug, p.name AS name, p.description AS description,
			       p.difficulty AS difficulty, p.time_estimate AS time_estimate,
			       collect(DISTINCT related.slug) AS related_slugs
		`, map[string]any{"slug": slug})
		if err != nil {
			return nil, err
		}

		if !record.Next(ctx) {
			return nil, fmt.Errorf("project not found: %s", slug)
		}

		r := record.Record()
		p := &model.Project{
			Slug:         getString(r, "slug"),
			Name:         getString(r, "name"),
			Description:  getString(r, "description"),
			Difficulty:   getInt(r, "difficulty"),
			TimeEstimate: getString(r, "time_estimate"),
		}

		if v, _ := r.Get("related_slugs"); v != nil {
			if slugs, ok := v.([]any); ok {
				for _, s := range slugs {
					if str, ok := s.(string); ok && str != "" {
						p.RelatedSlugs = append(p.RelatedSlugs, str)
					}
				}
			}
		}

		return p, nil
	})
	if err != nil {
		return nil, err
	}

	project := result.(*model.Project)
	if data, err := json.Marshal(project); err == nil {
		s.redis.Client().Set(ctx, cacheKey, data, 1*time.Hour)
	}

	return project, nil
}

func (s *ProjectService) GetToolkit(ctx context.Context, slug, ecosystem string) (*model.ProjectToolkit, error) {
	cacheKey := fmt.Sprintf("toolkit:%s:%s", slug, ecosystem)
	if cached, err := s.redis.Client().Get(ctx, cacheKey).Bytes(); err == nil {
		var tk model.ProjectToolkit
		if json.Unmarshal(cached, &tk) == nil {
			return &tk, nil
		}
	}

	project, err := s.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	session := s.neo4j.ReadSession(ctx)
	defer session.Close(ctx)

	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		records, err := tx.Run(ctx, `
			MATCH (p:Project {slug: $slug})-[r:REQUIRES_CATEGORY]->(sc:Subcategory)
			RETURN sc.slug AS subcategory, sc.name AS subcategory_name,
			       r.priority AS priority
			ORDER BY
			  CASE r.priority
			    WHEN 'essential' THEN 1
			    WHEN 'recommended' THEN 2
			    ELSE 3
			  END
		`, map[string]any{"slug": slug})
		if err != nil {
			return nil, err
		}

		var items []model.ToolkitItem
		for records.Next(ctx) {
			r := records.Record()
			items = append(items, model.ToolkitItem{
				Subcategory: getString(r, "subcategory"),
				Priority:    getString(r, "priority"),
			})
		}
		return items, nil
	})
	if err != nil {
		return nil, fmt.Errorf("get toolkit requirements: %w", err)
	}

	items := result.([]model.ToolkitItem)
	toolkit := &model.ProjectToolkit{
		Project:   *project,
		Ecosystem: ecosystem,
	}

	for _, item := range items {
		switch item.Priority {
		case "essential":
			toolkit.EssentialTools = append(toolkit.EssentialTools, item)
		case "recommended":
			toolkit.RecommendedTools = append(toolkit.RecommendedTools, item)
		default:
			toolkit.OptionalTools = append(toolkit.OptionalTools, item)
		}
	}

	if data, err := json.Marshal(toolkit); err == nil {
		s.redis.Client().Set(ctx, cacheKey, data, 30*time.Minute)
	}

	return toolkit, nil
}
