#!/bin/bash
# Qdrant collection initialization for Lost in the Tool Pool
# Run after Qdrant is healthy: ./qdrant-init.sh [host] [port]

HOST="${1:-localhost}"
PORT="${2:-6333}"
BASE="http://${HOST}:${PORT}"

echo "Initializing Qdrant collections on ${BASE}..."

# =============================================================================
# Tool Embeddings Collection
# Stores vector embeddings of tool descriptions for semantic search
# e.g., "something to cut curves in plywood" → jigsaw
# =============================================================================
curl -s -X PUT "${BASE}/collections/tools" \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 1024,
      "distance": "Cosine"
    },
    "optimizers_config": {
      "indexing_threshold": 10000
    },
    "on_disk_payload": false
  }' && echo " ✓ tools collection created"

# Create payload indexes for filtering
curl -s -X PUT "${BASE}/collections/tools/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "brand", "field_schema": "keyword"}' && echo " ✓ tools.brand index"

curl -s -X PUT "${BASE}/collections/tools/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "ecosystem", "field_schema": "keyword"}' && echo " ✓ tools.ecosystem index"

curl -s -X PUT "${BASE}/collections/tools/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "category", "field_schema": "keyword"}' && echo " ✓ tools.category index"

curl -s -X PUT "${BASE}/collections/tools/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "subcategory", "field_schema": "keyword"}' && echo " ✓ tools.subcategory index"

curl -s -X PUT "${BASE}/collections/tools/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "price", "field_schema": "float"}' && echo " ✓ tools.price index"

curl -s -X PUT "${BASE}/collections/tools/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "is_cordless", "field_schema": "bool"}' && echo " ✓ tools.is_cordless index"

# =============================================================================
# Project Embeddings Collection
# Stores vector embeddings of project descriptions for matching
# e.g., "I want to redo my bathroom" → bathroom-renovation project
# =============================================================================
curl -s -X PUT "${BASE}/collections/projects" \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 1024,
      "distance": "Cosine"
    },
    "optimizers_config": {
      "indexing_threshold": 1000
    },
    "on_disk_payload": false
  }' && echo " ✓ projects collection created"

curl -s -X PUT "${BASE}/collections/projects/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "difficulty", "field_schema": "integer"}' && echo " ✓ projects.difficulty index"

curl -s -X PUT "${BASE}/collections/projects/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "slug", "field_schema": "keyword"}' && echo " ✓ projects.slug index"

# =============================================================================
# Query Cache Collection
# Stores embeddings of past user queries for "did you mean?" matching
# and for identifying popular unanswered queries
# =============================================================================
curl -s -X PUT "${BASE}/collections/queries" \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 1024,
      "distance": "Cosine"
    },
    "optimizers_config": {
      "indexing_threshold": 50000
    },
    "on_disk_payload": true
  }' && echo " ✓ queries collection created"

curl -s -X PUT "${BASE}/collections/queries/index" \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "query_type", "field_schema": "keyword"}' && echo " ✓ queries.query_type index"

echo ""
echo "Qdrant initialization complete."
echo "Collections: tools, projects, queries"
echo ""
echo "Payload schema per collection:"
echo "  tools:    {sku, name, brand, ecosystem, category, subcategory, price, is_cordless, rating, slug}"
echo "  projects: {slug, name, difficulty, time_estimate, description}"
echo "  queries:  {query_text, query_type, session_id, timestamp, matched_count}"
