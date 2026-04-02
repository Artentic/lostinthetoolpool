package database

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/firehose"
	"github.com/aws/aws-sdk-go-v2/service/firehose/types"
)

// FirehoseClient sends analytics events to Kinesis Data Firehose.
// Events are buffered by Firehose and written to S3 as Parquet.
type FirehoseClient struct {
	client     *firehose.Client
	streamName string
}

func NewFirehose(region, streamName string) (*FirehoseClient, error) {
	cfg, err := awsconfig.LoadDefaultConfig(context.Background(), awsconfig.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	return &FirehoseClient{
		client:     firehose.NewFromConfig(cfg),
		streamName: streamName,
	}, nil
}

// SendEvent sends a single analytics event to Firehose.
// The event is JSON-encoded with a newline delimiter for Athena compatibility.
func (f *FirehoseClient) SendEvent(ctx context.Context, eventType string, data map[string]any) error {
	data["event_type"] = eventType

	payload, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("marshal event: %w", err)
	}

	// Add newline for JSON Lines format (Athena-compatible)
	payload = append(payload, '\n')

	_, err = f.client.PutRecord(ctx, &firehose.PutRecordInput{
		DeliveryStreamName: aws.String(f.streamName),
		Record:             &types.Record{Data: payload},
	})
	if err != nil {
		return fmt.Errorf("put firehose record: %w", err)
	}

	return nil
}

// SendEvents sends a batch of analytics events (up to 500 per call).
func (f *FirehoseClient) SendEvents(ctx context.Context, events []map[string]any) error {
	if len(events) == 0 {
		return nil
	}

	records := make([]types.Record, 0, len(events))
	for _, evt := range events {
		payload, err := json.Marshal(evt)
		if err != nil {
			continue
		}
		payload = append(payload, '\n')
		records = append(records, types.Record{Data: payload})
	}

	// Firehose max batch size is 500 records
	for i := 0; i < len(records); i += 500 {
		end := i + 500
		if end > len(records) {
			end = len(records)
		}
		batch := records[i:end]

		_, err := f.client.PutRecordBatch(ctx, &firehose.PutRecordBatchInput{
			DeliveryStreamName: aws.String(f.streamName),
			Records:            batch,
		})
		if err != nil {
			return fmt.Errorf("put firehose batch: %w", err)
		}
	}

	return nil
}
