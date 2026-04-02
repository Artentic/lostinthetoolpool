package database

import (
	"context"
	"fmt"
	"time"

	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)

type Neo4jClient struct {
	driver neo4j.DriverWithContext
}

func NewNeo4j(uri, user, password string) (*Neo4jClient, error) {
	driver, err := neo4j.NewDriverWithContext(uri, neo4j.BasicAuth(user, password, ""))
	if err != nil {
		return nil, fmt.Errorf("create neo4j driver: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := driver.VerifyConnectivity(ctx); err != nil {
		return nil, fmt.Errorf("verify neo4j connectivity: %w", err)
	}

	return &Neo4jClient{driver: driver}, nil
}

func (n *Neo4jClient) Driver() neo4j.DriverWithContext {
	return n.driver
}

func (n *Neo4jClient) Close(ctx context.Context) error {
	return n.driver.Close(ctx)
}

// ReadSession creates a read-only session for queries.
func (n *Neo4jClient) ReadSession(ctx context.Context) neo4j.SessionWithContext {
	return n.driver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
}

// WriteSession creates a write session for mutations.
func (n *Neo4jClient) WriteSession(ctx context.Context) neo4j.SessionWithContext {
	return n.driver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
}
