.PHONY: build run docker-build docker-push deploy

# Build locally
build:
	go build -o api cmd/api/main.go

# Run locally
run: build
	./api

# Build Docker image (ARM64 for Fargate Graviton)
docker-build:
	docker build --platform linux/arm64 -t litp-api .

# Push to ECR
docker-push: docker-build
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com
	docker tag litp-api:latest $(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com/litp-api:latest
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com/litp-api:latest

# Deploy (update Fargate service to use new image)
deploy: docker-push
	aws ecs update-service --cluster litp-cluster --service litp-api --force-new-deployment --region us-east-1
	@echo "Deploying new image — Fargate will roll out gradually"
