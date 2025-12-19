#!/bin/bash

# Test script for Stats API authentication
# Usage: ./scripts/test-stats-api.sh YOUR_WORKER_URL YOUR_API_KEY

WORKER_URL="${1:-https://french-by-examples-stats.your-subdomain.workers.dev}"
API_KEY="${2:-your-api-key-here}"

echo "Testing Stats API Authentication..."
echo "Worker URL: $WORKER_URL"
echo "API Key: ${API_KEY:0:8}...${API_KEY: -4}"
echo ""

# Test without authentication (should get 401)
echo "Test 1: No authentication (should fail with 401)"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$WORKER_URL/api/stats/overview")
echo "$response"
echo ""

# Test with wrong authentication (should get 401)
echo "Test 2: Wrong API key (should fail with 401)"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Authorization: Bearer wrong-key" "$WORKER_URL/api/stats/overview")
echo "$response"
echo ""

# Test with correct authentication (should succeed with 200)
echo "Test 3: Correct API key (should succeed with 200)"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Authorization: Bearer $API_KEY" "$WORKER_URL/api/stats/overview")
echo "$response"
echo ""

echo "If Test 3 returned HTTP_CODE:200, your Worker is configured correctly!"
echo "If it returned 401, the API_KEY doesn't match the Worker secret."
