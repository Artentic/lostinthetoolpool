# AWS Serverless Setup Guide

Everything runs on AWS. One account, one bill, one console.

## Prerequisites
- AWS CLI configured (`aws configure`)
- Go 1.22+
- Node.js 20+
- An AWS account with us-east-1 access

## 1. Create DynamoDB Tables

```bash
# Products table
aws dynamodb create-table \
  --table-name litp-products \
  --attribute-definitions \
    AttributeName=sku,AttributeType=S \
    AttributeName=slug,AttributeType=S \
    AttributeName=ecosystem,AttributeType=S \
    AttributeName=category,AttributeType=S \
    AttributeName=subcategory,AttributeType=S \
    AttributeName=rating,AttributeType=N \
  --key-schema AttributeName=sku,KeyType=HASH \
  --global-secondary-indexes \
    '[{"IndexName":"slug-index","KeySchema":[{"AttributeName":"slug","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}},
      {"IndexName":"ecosystem-category-index","KeySchema":[{"AttributeName":"ecosystem","KeyType":"HASH"},{"AttributeName":"category","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}},
      {"IndexName":"subcategory-rating-index","KeySchema":[{"AttributeName":"subcategory","KeyType":"HASH"},{"AttributeName":"rating","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Content table (projects, ecosystems, categories, relationships)
aws dynamodb create-table \
  --table-name litp-content \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=sk,AttributeType=S \
    AttributeName=content_type,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=sk,KeyType=RANGE \
  --global-secondary-indexes \
    '[{"IndexName":"type-index","KeySchema":[{"AttributeName":"content_type","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Cache table (with TTL)
aws dynamodb create-table \
  --table-name litp-cache \
  --attribute-definitions AttributeName=cache_key,AttributeType=S \
  --key-schema AttributeName=cache_key,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

aws dynamodb update-time-to-live \
  --table-name litp-cache \
  --time-to-live-specification Enabled=true,AttributeName=expires_at

# Price history table
aws dynamodb create-table \
  --table-name litp-prices \
  --attribute-definitions \
    AttributeName=sku,AttributeType=S \
    AttributeName=timestamp_retailer,AttributeType=S \
  --key-schema \
    AttributeName=sku,KeyType=HASH \
    AttributeName=timestamp_retailer,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## 2. Create OpenSearch Serverless Collection

```bash
# Create encryption policy
aws opensearchserverless create-security-policy \
  --name litp-encryption \
  --type encryption \
  --policy '{"Rules":[{"ResourceType":"collection","Resource":["collection/litp-vectors"]}],"AWSOwnedKey":true}'

# Create network policy (public access)
aws opensearchserverless create-security-policy \
  --name litp-network \
  --type network \
  --policy '[{"Rules":[{"ResourceType":"collection","Resource":["collection/litp-vectors"]},{"ResourceType":"dashboard","Resource":["collection/litp-vectors"]}],"AllowFromPublic":true}]'

# Create data access policy (replace ACCOUNT_ID and ROLE_ARN)
aws opensearchserverless create-access-policy \
  --name litp-access \
  --type data \
  --policy '[{"Rules":[{"ResourceType":"collection","Resource":["collection/litp-vectors"],"Permission":["aoss:*"]},{"ResourceType":"index","Resource":["index/litp-vectors/*"],"Permission":["aoss:*"]}],"Principal":["arn:aws:iam::ACCOUNT_ID:role/litp-lambda-role"]}]'

# Create collection
aws opensearchserverless create-collection \
  --name litp-vectors \
  --type VECTORSEARCH \
  --region us-east-1
```

After collection is ACTIVE, create the k-NN index:
```bash
# Get collection endpoint from:
aws opensearchserverless batch-get-collection --names litp-vectors

# Create tools index with k-NN vector field
curl -X PUT "$COLLECTION_ENDPOINT/tools" \
  -H "Content-Type: application/json" \
  --aws-sigv4 "aws:amz:us-east-1:aoss" \
  -d '{
    "settings": {"index": {"knn": true}},
    "mappings": {
      "properties": {
        "embedding": {"type": "knn_vector", "dimension": 1024, "method": {"name": "hnsw", "engine": "faiss"}},
        "sku": {"type": "keyword"},
        "name": {"type": "text"},
        "brand": {"type": "keyword"},
        "ecosystem": {"type": "keyword"},
        "category": {"type": "keyword"},
        "price": {"type": "float"},
        "is_cordless": {"type": "boolean"}
      }
    }
  }'
```

## 3. Create Analytics Pipeline (Firehose → S3 → Athena)

```bash
# Create S3 bucket for analytics
aws s3 mb s3://litp-analytics-ACCOUNT_ID --region us-east-1

# Create Firehose delivery stream
aws firehose create-delivery-stream \
  --delivery-stream-name litp-analytics \
  --delivery-stream-type DirectPut \
  --extended-s3-destination-configuration '{
    "RoleARN": "arn:aws:iam::ACCOUNT_ID:role/litp-firehose-role",
    "BucketARN": "arn:aws:s3:::litp-analytics-ACCOUNT_ID",
    "Prefix": "events/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/",
    "ErrorOutputPrefix": "errors/",
    "BufferingHints": {"SizeInMBs": 5, "IntervalInSeconds": 60},
    "CompressionFormat": "GZIP"
  }' \
  --region us-east-1

# Create Athena workgroup
aws athena create-work-group \
  --name litp \
  --configuration "ResultConfiguration={OutputLocation=s3://litp-analytics-ACCOUNT_ID/athena-results/}" \
  --region us-east-1

# Run Athena table creation (see infra/athena-tables.sql)
```

## 4. Create Lambda + API Gateway

```bash
# Create IAM role
aws iam create-role \
  --role-name litp-lambda-role \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]
  }'

# Attach policies
aws iam attach-role-policy --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
aws iam attach-role-policy --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
aws iam attach-role-policy --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonKinesisFirehoseFullAccess

# Build and deploy Lambda
cd backend
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap cmd/lambda/main.go
zip -j lambda.zip bootstrap

aws lambda create-function \
  --function-name litp-api \
  --runtime provided.al2023 \
  --architectures arm64 \
  --handler bootstrap \
  --zip-file fileb://lambda.zip \
  --role arn:aws:iam::ACCOUNT_ID:role/litp-lambda-role \
  --memory-size 512 \
  --timeout 30 \
  --region us-east-1 \
  --environment "Variables={
    AWS_REGION=us-east-1,
    OPENSEARCH_ENDPOINT=https://xxx.us-east-1.aoss.amazonaws.com,
    FIREHOSE_STREAM=litp-analytics,
    COHERE_API_KEY=your-key-here,
    BEDROCK_MODEL=anthropic.claude-sonnet-4-6-20250514-v1:0
  }"

# Create HTTP API
API_ID=$(aws apigatewayv2 create-api --name litp-api --protocol-type HTTP --query 'ApiId' --output text)
INTEGRATION_ID=$(aws apigatewayv2 create-integration --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:us-east-1:ACCOUNT_ID:function:litp-api \
  --payload-format-version 2.0 --query 'IntegrationId' --output text)
aws apigatewayv2 create-route --api-id $API_ID --route-key '$default' --target integrations/$INTEGRATION_ID
aws apigatewayv2 create-stage --api-id $API_ID --stage-name '$default' --auto-deploy
aws lambda add-permission --function-name litp-api --statement-id apigw \
  --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:ACCOUNT_ID:$API_ID/*"

echo "API URL: https://$API_ID.execute-api.us-east-1.amazonaws.com"
```

## 5. Frontend: CloudFront + S3

```bash
# Create S3 bucket for frontend
aws s3 mb s3://lostinthetoolpool-frontend --region us-east-1

# Build frontend
cd frontend
npm install
VITE_API_URL=https://API_ID.execute-api.us-east-1.amazonaws.com npm run build

# Upload
aws s3 sync .svelte-kit/cloudflare s3://lostinthetoolpool-frontend --delete

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name lostinthetoolpool-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

## 6. Route 53 DNS

```bash
aws route53 create-hosted-zone --name lostinthetoolpool.com --caller-reference $(date +%s)
# Point domain to CloudFront distribution
# Point api.lostinthetoolpool.com to API Gateway custom domain
```

## 7. Seed Data

```bash
# Run seed script to populate DynamoDB with initial products, projects, ecosystems
go run cmd/seed/main.go
```

## Cost Summary

| Service | Launch (free tier) | Growth (10K/day) |
|---|---|---|
| DynamoDB | $0 | ~$15 |
| Lambda + API Gateway | $0 | ~$15 |
| CloudFront + S3 | $0 | ~$5 |
| OpenSearch Serverless | ~$25 | ~$50 |
| Firehose + S3 | $0-2 | ~$10 |
| Athena | $0-2 | ~$5 |
| Bedrock (Claude) | ~$5-20 | ~$50-150 |
| Route 53 | $0.50 | $0.50 |
| **Total** | **~$30-50/mo** | **~$150-250/mo** |
