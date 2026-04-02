.PHONY: build-lambda build-api deploy-lambda

# Build Lambda function (ARM64 for Graviton — 20% cheaper)
build-lambda:
	cd backend && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap cmd/lambda/main.go
	cd backend && zip -j lambda.zip bootstrap
	@echo "Built: backend/lambda.zip"

# Build standalone API server
build-api:
	cd backend && go build -o api cmd/api/main.go
	@echo "Built: backend/api"

# Deploy Lambda function (requires AWS CLI configured)
deploy-lambda: build-lambda
	aws lambda update-function-code \
		--function-name litp-api \
		--zip-file fileb://backend/lambda.zip \
		--region us-east-1
	@echo "Deployed to Lambda"

# Create Lambda function (first time only)
create-lambda: build-lambda
	aws lambda create-function \
		--function-name litp-api \
		--runtime provided.al2023 \
		--architectures arm64 \
		--handler bootstrap \
		--zip-file fileb://backend/lambda.zip \
		--role $(LAMBDA_ROLE_ARN) \
		--memory-size 512 \
		--timeout 30 \
		--region us-east-1 \
		--environment "Variables={$$(cat .env.lambda | tr '\n' ',' | sed 's/,$$//')}"
	@echo "Created Lambda function"
