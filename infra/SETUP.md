# Deployment Setup Guide

## 1. Managed Databases (AWS Marketplace)

### ClickHouse Cloud
1. AWS Marketplace → "ClickHouse Cloud" → Subscribe
2. Create serverless service in AWS us-east-1
3. Run schemas: `clickhouse-init.sql`, `clickhouse-analytics.sql`
4. Run seed: `seed-clickhouse.sql`

### Qdrant Cloud
1. AWS Marketplace → "Qdrant" → Subscribe
2. Create free cluster on AWS us-east-1
3. Run: `qdrant-init.sh HOST PORT`

### Neo4j Aura
1. AWS Marketplace → "Neo4j" → Subscribe
2. Create AuraDB Free on AWS
3. Run `neo4j-init.cypher` via Browser

## 2. ECR Repository

```bash
aws ecr create-repository --repository-name litp-api --region us-east-1
```

## 3. Build & Push Container

```bash
cd backend
make docker-push AWS_ACCOUNT_ID=123456789012
```

## 4. ECS Fargate

```bash
# Create cluster
aws ecs create-cluster --cluster-name litp-cluster --region us-east-1

# Create task definition (save as task-def.json, then register)
aws ecs register-task-definition --cli-input-json file://infra/task-def.json

# Create ALB, target group, listener (use console — easier for first time)
# Then create service:
aws ecs create-service \
  --cluster litp-cluster \
  --service-name litp-api \
  --task-definition litp-api \
  --desired-count 1 \
  --launch-type FARGATE \
  --capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1 \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:...,containerName=api,containerPort=8080" \
  --region us-east-1
```

## 5. Frontend (CloudFront + S3)

```bash
aws s3 mb s3://lostinthetoolpool-frontend --region us-east-1

cd frontend && npm install
VITE_API_URL=https://api.lostinthetoolpool.com npm run build
aws s3 sync build/ s3://lostinthetoolpool-frontend --delete

# Create CloudFront distribution via console:
# Origin: S3 with OAC, Custom domain + ACM cert
```

## 6. Hetzner (Data Pipeline)

```bash
# On Hetzner CX22 (€4.49/mo):
apt update && apt install -y golang-go clickhouse-server
mkdir -p /opt/litp/{ingester,data/{raw,normalized,embeddings},logs}

# Copy ingestion code, build, set up cron:
# 0 2 * * * /opt/litp/ingester full-pipeline
# 0 6,12,18 * * * /opt/litp/ingester price-update
```

## 7. DNS (Route 53)

```bash
aws route53 create-hosted-zone --name lostinthetoolpool.com --caller-reference $(date +%s)
# A record → CloudFront
# CNAME api.* → ALB
```

## 8. Deploy Updates

```bash
# API: build new image, push, update service
cd backend && make deploy AWS_ACCOUNT_ID=123456789012

# Frontend: build and sync
cd frontend && npm run build && aws s3 sync build/ s3://lostinthetoolpool-frontend --delete
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```
