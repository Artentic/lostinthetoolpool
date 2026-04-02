# Deployment Setup Guide

All services run on AWS infrastructure in us-east-1. Managed databases
purchased through AWS Marketplace for consolidated billing.

## 1. Managed Databases (all on AWS infra, all via AWS Marketplace)

### ClickHouse Cloud
1. AWS Marketplace → Search "ClickHouse Cloud" → Subscribe
2. Select AWS us-east-1, create serverless service
3. Create database: `CREATE DATABASE litp`
4. Run schema: `database/schemas/clickhouse-init.sql`
5. Run analytics schema: `database/schemas/clickhouse-analytics.sql`
6. Run seed data: `database/scripts/seed-clickhouse.sql`
7. Note connection string: `clickhouse://default:PASSWORD@HOST:8443/litp?secure=true`

### Qdrant Cloud
1. AWS Marketplace → Search "Qdrant" → Subscribe
2. Create free cluster, select AWS us-east-1
3. Run init script: `database/schemas/qdrant-init.sh HOST PORT`
4. Note host and port

### Neo4j Aura
1. AWS Marketplace → Search "Neo4j" → Subscribe
2. Create AuraDB Free instance on AWS
3. Run schema via Neo4j Browser: `database/schemas/neo4j-init.cypher`
4. Note URI, username, password

### Upstash Redis
1. AWS Marketplace → Search "Upstash" → Subscribe
2. Create Redis database in AWS us-east-1, enable TLS
3. Note `rediss://` connection URL

## 2. Lambda + API Gateway

```bash
# Build Lambda binary (ARM64 for Graviton)
cd backend
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc \
  -o bootstrap cmd/lambda/main.go
zip -j lambda.zip bootstrap

# Create IAM role
aws iam create-role --role-name litp-lambda-role \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"lambda.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

# Create Lambda function
aws lambda create-function \
  --function-name litp-api \
  --runtime provided.al2023 \
  --architectures arm64 \
  --handler bootstrap \
  --zip-file fileb://lambda.zip \
  --role arn:aws:iam::ACCOUNT_ID:role/litp-lambda-role \
  --memory-size 512 \
  --timeout 30 \
  --region us-east-1

# Set environment variables
aws lambda update-function-configuration \
  --function-name litp-api \
  --environment "Variables={
    CLICKHOUSE_DSN=clickhouse://default:xxx@xxx.clickhouse.cloud:8443/litp?secure=true,
    QDRANT_HOST=xxx.cloud.qdrant.io,
    QDRANT_PORT=6334,
    NEO4J_URI=neo4j+s://xxx.databases.neo4j.io,
    NEO4J_USER=neo4j,
    NEO4J_PASSWORD=xxx,
    REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379,
    AWS_REGION=us-east-1,
    BEDROCK_MODEL=anthropic.claude-sonnet-4-6-20250514-v1:0,
    COHERE_API_KEY=xxx
  }"

# Create HTTP API Gateway
API_ID=$(aws apigatewayv2 create-api \
  --name litp-api --protocol-type HTTP \
  --query 'ApiId' --output text)

INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:us-east-1:ACCOUNT_ID:function:litp-api \
  --payload-format-version 2.0 \
  --query 'IntegrationId' --output text)

aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key '$default' \
  --target integrations/$INTEGRATION_ID

aws apigatewayv2 create-stage \
  --api-id $API_ID \
  --stage-name '$default' \
  --auto-deploy

aws lambda add-permission \
  --function-name litp-api \
  --statement-id apigw \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:ACCOUNT_ID:$API_ID/*"

echo "API: https://$API_ID.execute-api.us-east-1.amazonaws.com"
```

## 3. Frontend (CloudFront + S3)

```bash
# Create S3 bucket
aws s3 mb s3://lostinthetoolpool-frontend --region us-east-1

# Build frontend
cd frontend
npm install
VITE_API_URL=https://$API_ID.execute-api.us-east-1.amazonaws.com \
  npm run build

# Sync to S3
aws s3 sync build/ s3://lostinthetoolpool-frontend --delete

# Create CloudFront distribution (use console for easier setup)
# - Origin: S3 bucket with OAC
# - Default root object: index.html
# - Custom error response: 404 → /index.html (SPA fallback)
# - Alternate domain: lostinthetoolpool.com
# - SSL certificate: ACM (us-east-1)
```

## 4. DNS (Route 53)

```bash
aws route53 create-hosted-zone \
  --name lostinthetoolpool.com \
  --caller-reference $(date +%s)

# A record → CloudFront distribution
# CNAME: api.lostinthetoolpool.com → API Gateway custom domain
```

## 5. PostHog (EU)

1. Sign up at https://eu.posthog.com
2. Create project, get API key
3. Set in frontend env: `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST=https://eu.posthog.com`

## 6. Deploy Updates

```bash
# Backend
make build-lambda
aws lambda update-function-code \
  --function-name litp-api \
  --zip-file fileb://backend/lambda.zip

# Frontend
cd frontend && npm run build
aws s3 sync build/ s3://lostinthetoolpool-frontend --delete
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```
