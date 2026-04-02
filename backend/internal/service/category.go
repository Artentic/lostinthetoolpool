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

type CategoryService struct {
	neo4j *database.Neo4jClient
	redis *database.RedisClient
}

func NewCategoryService(neo4j *database.Neo4jClient, redis *database.RedisClient) *CategoryService {
	return &CategoryService{neo4j: neo4j, redis: redis}
}

func (s *CategoryService) List(ctx context.Context) ([]model.Category, error) {
	cacheKey := "categories:tree"
	if cached, err := s.redis.Client().Get(ctx, cacheKey).Bytes(); err == nil {
		var categories []model.Category
		if json.Unmarshal(cached, &categories) == nil {
			return categories, nil
		}
	}

	session := s.neo4j.ReadSession(ctx)
	defer session.Close(ctx)

	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		records, err := tx.Run(ctx, `
			MATCH (c:Category)
			OPTIONAL MATCH (c)-[:HAS_SUBCATEGORY]->(sc:Subcategory)
			RETURN c.slug AS cat_slug, c.name AS cat_name,
			       collect({slug: sc.slug, name: sc.name}) AS subcategories
			ORDER BY c.name
		`, nil)
		if err != nil {
			return nil, err
		}

		var categories []model.Category
		for records.Next(ctx) {
			r := records.Record()
			cat := model.Category{
				Slug: getString(r, "cat_slug"),
				Name: getString(r, "cat_name"),
			}
			if v, _ := r.Get("subcategories"); v != nil {
				if subs, ok := v.([]any); ok {
					for _, sub := range subs {
						if m, ok := sub.(map[string]any); ok {
							slug, _ := m["slug"].(string)
							name, _ := m["name"].(string)
							if slug != "" {
								cat.Subcategories = append(cat.Subcategories, model.Subcategory{
									Slug: slug,
									Name: name,
								})
							}
						}
					}
				}
			}
			categories = append(categories, cat)
		}
		return categories, nil
	})
	if err != nil {
		return nil, fmt.Errorf("list categories: %w", err)
	}

	categories := result.([]model.Category)
	if data, err := json.Marshal(categories); err == nil {
		s.redis.Client().Set(ctx, cacheKey, data, 1*time.Hour)
	}

	return categories, nil
}
