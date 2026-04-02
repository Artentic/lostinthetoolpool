package database

import (
	"context"
	"fmt"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
)

type ClickHouseClient struct {
	conn driver.Conn
}

func NewClickHouse(dsn string) (*ClickHouseClient, error) {
	opts, err := clickhouse.ParseDSN(dsn)
	if err != nil {
		return nil, fmt.Errorf("parse clickhouse dsn: %w", err)
	}

	opts.MaxOpenConns = 10
	opts.MaxIdleConns = 5
	opts.ConnMaxLifetime = 10 * time.Minute

	conn, err := clickhouse.Open(opts)
	if err != nil {
		return nil, fmt.Errorf("open clickhouse: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := conn.Ping(ctx); err != nil {
		return nil, fmt.Errorf("ping clickhouse: %w", err)
	}

	return &ClickHouseClient{conn: conn}, nil
}

func (c *ClickHouseClient) Conn() driver.Conn {
	return c.conn
}

func (c *ClickHouseClient) Close() error {
	return c.conn.Close()
}
