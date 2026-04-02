package database

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type DynamoClient struct {
	client         *dynamodb.Client
	productsTable  string
	contentTable   string
	cacheTable     string
	pricesTable    string
}

func NewDynamo(region string) (*DynamoClient, error) {
	cfg, err := awsconfig.LoadDefaultConfig(context.Background(), awsconfig.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	client := dynamodb.NewFromConfig(cfg)

	return &DynamoClient{
		client:        client,
		productsTable: "litp-products",
		contentTable:  "litp-content",
		cacheTable:    "litp-cache",
		pricesTable:   "litp-prices",
	}, nil
}

func (d *DynamoClient) Client() *dynamodb.Client {
	return d.client
}

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

func (d *DynamoClient) GetProductBySKU(ctx context.Context, sku string) (map[string]types.AttributeValue, error) {
	out, err := d.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &d.productsTable,
		Key: map[string]types.AttributeValue{
			"sku": &types.AttributeValueMemberS{Value: sku},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("get product by sku: %w", err)
	}
	if out.Item == nil {
		return nil, fmt.Errorf("product not found: %s", sku)
	}
	return out.Item, nil
}

func (d *DynamoClient) GetProductBySlug(ctx context.Context, slug string) (map[string]types.AttributeValue, error) {
	out, err := d.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &d.productsTable,
		IndexName:              aws.String("slug-index"),
		KeyConditionExpression: aws.String("slug = :slug"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":slug": &types.AttributeValueMemberS{Value: slug},
		},
		Limit: aws.Int32(1),
	})
	if err != nil {
		return nil, fmt.Errorf("get product by slug: %w", err)
	}
	if len(out.Items) == 0 {
		return nil, fmt.Errorf("product not found: %s", slug)
	}
	return out.Items[0], nil
}

func (d *DynamoClient) ListProductsByEcosystem(ctx context.Context, ecosystem string) ([]map[string]types.AttributeValue, error) {
	out, err := d.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &d.productsTable,
		IndexName:              aws.String("ecosystem-category-index"),
		KeyConditionExpression: aws.String("ecosystem = :eco"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":eco": &types.AttributeValueMemberS{Value: ecosystem},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("list products by ecosystem: %w", err)
	}
	return out.Items, nil
}

func (d *DynamoClient) ListProductsBySKUs(ctx context.Context, skus []string) ([]map[string]types.AttributeValue, error) {
	if len(skus) == 0 {
		return nil, nil
	}

	keys := make([]map[string]types.AttributeValue, len(skus))
	for i, sku := range skus {
		keys[i] = map[string]types.AttributeValue{
			"sku": &types.AttributeValueMemberS{Value: sku},
		}
	}

	out, err := d.client.BatchGetItem(ctx, &dynamodb.BatchGetItemInput{
		RequestItems: map[string]types.KeysAndAttributes{
			d.productsTable: {Keys: keys},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("batch get products: %w", err)
	}
	return out.Responses[d.productsTable], nil
}

// ============================================================================
// CONTENT OPERATIONS (projects, ecosystems, categories)
// ============================================================================

func (d *DynamoClient) GetContent(ctx context.Context, pk, sk string) (map[string]types.AttributeValue, error) {
	out, err := d.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &d.contentTable,
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: pk},
			"sk": &types.AttributeValueMemberS{Value: sk},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("get content: %w", err)
	}
	if out.Item == nil {
		return nil, fmt.Errorf("not found: %s/%s", pk, sk)
	}
	return out.Item, nil
}

func (d *DynamoClient) QueryContent(ctx context.Context, pk string, skPrefix string) ([]map[string]types.AttributeValue, error) {
	input := &dynamodb.QueryInput{
		TableName:              &d.contentTable,
		KeyConditionExpression: aws.String("pk = :pk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: pk},
		},
	}

	if skPrefix != "" {
		input.KeyConditionExpression = aws.String("pk = :pk AND begins_with(sk, :sk)")
		input.ExpressionAttributeValues[":sk"] = &types.AttributeValueMemberS{Value: skPrefix}
	}

	out, err := d.client.Query(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("query content: %w", err)
	}
	return out.Items, nil
}

func (d *DynamoClient) ListContentByType(ctx context.Context, contentType string) ([]map[string]types.AttributeValue, error) {
	out, err := d.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &d.contentTable,
		IndexName:              aws.String("type-index"),
		KeyConditionExpression: aws.String("content_type = :t"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":t": &types.AttributeValueMemberS{Value: contentType},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("list content by type: %w", err)
	}
	return out.Items, nil
}

// ============================================================================
// CACHE OPERATIONS (DynamoDB with TTL)
// ============================================================================

func (d *DynamoClient) CacheGet(ctx context.Context, key string) (string, error) {
	out, err := d.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &d.cacheTable,
		Key: map[string]types.AttributeValue{
			"cache_key": &types.AttributeValueMemberS{Value: key},
		},
	})
	if err != nil {
		return "", err
	}
	if out.Item == nil {
		return "", fmt.Errorf("cache miss")
	}

	var data string
	if err := attributevalue.Unmarshal(out.Item["data"], &data); err != nil {
		return "", err
	}
	return data, nil
}

func (d *DynamoClient) CacheSet(ctx context.Context, key, data string, ttl time.Duration) error {
	expiresAt := time.Now().Add(ttl).Unix()

	_, err := d.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &d.cacheTable,
		Item: map[string]types.AttributeValue{
			"cache_key":  &types.AttributeValueMemberS{Value: key},
			"data":       &types.AttributeValueMemberS{Value: data},
			"expires_at": &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", expiresAt)},
		},
	})
	return err
}

// ============================================================================
// PRICE HISTORY
// ============================================================================

func (d *DynamoClient) GetPriceHistory(ctx context.Context, sku string, limit int) ([]map[string]types.AttributeValue, error) {
	out, err := d.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &d.pricesTable,
		KeyConditionExpression: aws.String("sku = :sku"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":sku": &types.AttributeValueMemberS{Value: sku},
		},
		ScanIndexForward: aws.Bool(false), // newest first
		Limit:            aws.Int32(int32(limit)),
	})
	if err != nil {
		return nil, fmt.Errorf("get price history: %w", err)
	}
	return out.Items, nil
}
