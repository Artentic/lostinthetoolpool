package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/cache"
	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/model"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)

type EcosystemService struct {
	neo4j *database.Neo4jClient
	cache *cache.Memory
}

func NewEcosystemService(neo4j *database.Neo4jClient, c *cache.Memory) *EcosystemService {
	return &EcosystemService{neo4j: neo4j, cache: c}
}

func (s *EcosystemService) List(ctx context.Context) ([]model.Ecosystem, error) {
	if data, ok := s.cache.Get("ecosystems:all"); ok {
		var ecosystems []model.Ecosystem
		if json.Unmarshal(data, &ecosystems) == nil {
			return ecosystems, nil
		}
	}

	session := s.neo4j.ReadSession(ctx)
	defer session.Close(ctx)

	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		records, err := tx.Run(ctx, `
			MATCH (b:Brand)-[:OWNS]->(e:Ecosystem)
			RETURN e.slug AS slug, e.name AS name, b.name AS brand,
			       e.voltage AS voltage, e.tool_count AS tool_count,
			       e.target AS target, b.parent_company AS parent_company
			ORDER BY e.tool_count DESC
		`, nil)
		if err != nil {
			return nil, err
		}

		var ecosystems []model.Ecosystem
		for records.Next(ctx) {
			r := records.Record()
			ecosystems = append(ecosystems, model.Ecosystem{
				Slug:          getString(r, "slug"),
				Name:          getString(r, "name"),
				Brand:         getString(r, "brand"),
				Voltage:       getInt(r, "voltage"),
				ToolCount:     getInt(r, "tool_count"),
				Target:        getString(r, "target"),
				ParentCompany: getString(r, "parent_company"),
			})
		}
		return ecosystems, nil
	})
	if err != nil {
		return nil, fmt.Errorf("list ecosystems: %w", err)
	}

	ecosystems := result.([]model.Ecosystem)
	if data, err := json.Marshal(ecosystems); err == nil {
		s.cache.Set("ecosystems:all", data, 1*time.Hour)
	}
	return ecosystems, nil
}

func (s *EcosystemService) GetBySlug(ctx context.Context, slug string) (*model.Ecosystem, error) {
	cacheKey := "ecosystem:" + slug
	if data, ok := s.cache.Get(cacheKey); ok {
		var eco model.Ecosystem
		if json.Unmarshal(data, &eco) == nil {
			return &eco, nil
		}
	}

	session := s.neo4j.ReadSession(ctx)
	defer session.Close(ctx)

	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		record, err := tx.Run(ctx, `
			MATCH (b:Brand)-[:OWNS]->(e:Ecosystem {slug: $slug})
			RETURN e.slug AS slug, e.name AS name, b.name AS brand,
			       e.voltage AS voltage, e.tool_count AS tool_count,
			       e.target AS target, b.parent_company AS parent_company
		`, map[string]any{"slug": slug})
		if err != nil {
			return nil, err
		}
		if !record.Next(ctx) {
			return nil, fmt.Errorf("ecosystem not found: %s", slug)
		}
		r := record.Record()
		return &model.Ecosystem{
			Slug:          getString(r, "slug"),
			Name:          getString(r, "name"),
			Brand:         getString(r, "brand"),
			Voltage:       getInt(r, "voltage"),
			ToolCount:     getInt(r, "tool_count"),
			Target:        getString(r, "target"),
			ParentCompany: getString(r, "parent_company"),
		}, nil
	})
	if err != nil {
		return nil, err
	}

	eco := result.(*model.Ecosystem)
	if data, err := json.Marshal(eco); err == nil {
		s.cache.Set(cacheKey, data, 1*time.Hour)
	}
	return eco, nil
}

// neo4j record helpers
func getString(r *neo4j.Record, key string) string {
	v, _ := r.Get(key)
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}

func getInt(r *neo4j.Record, key string) int {
	v, _ := r.Get(key)
	switch n := v.(type) {
	case int64:
		return int(n)
	case float64:
		return int(n)
	default:
		return 0
	}
}
