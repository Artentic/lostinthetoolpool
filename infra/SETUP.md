# Serverless Setup Guide

## 1. Create Managed Database Accounts (Free Tiers)

### ClickHouse Cloud
1. Go to https://clickhouse.cloud
2. Sign up, select AWS us-east-1
3. Create a serverless service
4. Note the connection string: `clickhouse://default:PASSWORD@HOST:8443/litp?secure=true`
5. Run `database/schemas/clickhouse-init.sql` and `database/schemas/clickhouse-analytics.sql`
6. Run `database/scripts/seed-clickhouse.sql`

### Qdrant Cloud
1. Go to https://cloud.qdrant.io
2. Sign up, create a free cluster on AWS us-east-1
3. Note the host and API key
4. Run `database/schemas/qdrant-init.sh HOST PORT`

### Neo4j Aura
1. Go to https://neo4j.com/cloud/aura-free
2. Create a free instance (AWS)
3. Save the connection URI, username, and password
4. Run `database/schemas/neo4j-init.cypher` via the Neo4j Browser

### Upstash Redis
1. Go to https://upstash.com
2. Create a Redis database in AWS us-east-1
3. Enable TLS, note the `rediss://` connection URL

## 2. AWS Setup

### Create IAM Role for Lambda
```bash
aws iam create-role \
  --role-name litp-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach basic execution policy (CloudWatch logs)
aws iam attach-role-policy \
  --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Attach Bedrock access
aws iam attach-role-policy \
  --role-name litp-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

### Create Lambda Function
```bash
# Build
cd backend
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap cmd/lambda/main.go
zip -j lambda.zip bootstrap

# Create
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
    CLICKHOUSE_DSN=clickhouse://...,
    QDRANT_HOST=...,
    QDRANT_PORT=6334,
    NEO4J_URI=neo4j+s://...,
    NEO4J_USER=neo4j,
    NEO4J_PASSWORD=...,
    REDIS_URL=rediss://...,
    COHERE_API_KEY=...,
    BEDROCK_MODEL=anthropic.claude-sonnet-4-6-20250514-v1:0
  }"
```

### Create API Gateway (HTTP API)
```bash
# Create HTTP API
aws apigatewayv2 create-api \
  --name litp-api \
  --protocol-type HTTP \
  --region us-east-1

# Create Lambda integration
aws apigatewayv2 create-integration \
  --api-id API_ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:us-east-1:ACCOUNT_ID:function:litp-api \
  --payload-format-version 2.0

# Create catch-all route
aws apigatewayv2 create-route \
  --api-id API_ID \
  --route-key '$default' \
  --target integrations/INTEGRATION_ID

# Create stage with auto-deploy
aws apigatewayv2 create-stage \
  --api-id API_ID \
  --stage-name '$default' \
  --auto-deploy

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \
  --function-name litp-api \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:ACCOUNT_ID:API_ID/*"
```

The API will be available at: `https://API_ID.execute-api.us-east-1.amazonaws.com`

### Optional: Custom Domain
```bash
# Add custom domain to API Gateway
aws apigatewayv2 create-domain-name \
  --domain-name api.lostinthetoolpool.com \
  --domain-name-configurations CertificateArn=ACM_CERT_ARN

# Map to API
aws apigatewayv2 create-api-mapping \
  --api-id API_ID \
  --domain-name api.lostinthetoolpool.com \
  --stage '$default'
```

## 3. Frontend Deployment (Cloudflare Pages)

```bash
cd frontend
npm install
npm run build

# Connect to Cloudflare Pages via dashboard or Wrangler
npx wrangler pages deploy .svelte-kit/cloudflare --project-name lostinthetoolpool
```

Set environment variable in Cloudflare Pages dashboard:
- `VITE_API_URL` = `https://api.lostinthetoolpool.com` (or the API Gateway URL)

## 4. PostHog Setup

1. Go to https://eu.posthog.com (EU instance)
2. Create project
3. Get project API key
4. Set in Cloudflare Pages env: `VITE_POSTHOG_KEY` = your key
5. `VITE_POSTHOG_HOST` = `https://eu.posthog.com`

## 5. Cohere API Key

1. Go to https://dashboard.cohere.com
2. Create API key
3. Set in Lambda env: `COHERE_API_KEY` = your key

## 6. DNS (Cloudflare)

```
lostinthetoolpool.com     → Cloudflare Pages
api.lostinthetoolpool.com → API Gateway custom domain
```
