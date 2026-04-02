package database

import (
	"context"
	"fmt"
	"time"

	pb "github.com/qdrant/go-client/qdrant"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type QdrantClient struct {
	conn    *grpc.ClientConn
	points  pb.PointsClient
	collect pb.CollectionsClient
}

func NewQdrant(host, port string) (*QdrantClient, error) {
	addr := fmt.Sprintf("%s:%s", host, port)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	conn, err := grpc.DialContext(ctx, addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		return nil, fmt.Errorf("connect to qdrant: %w", err)
	}

	return &QdrantClient{
		conn:    conn,
		points:  pb.NewPointsClient(conn),
		collect: pb.NewCollectionsClient(conn),
	}, nil
}

func (q *QdrantClient) Points() pb.PointsClient {
	return q.points
}

func (q *QdrantClient) Collections() pb.CollectionsClient {
	return q.collect
}

func (q *QdrantClient) Close() error {
	return q.conn.Close()
}
