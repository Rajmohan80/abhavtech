#!/bin/bash
# serve.sh — Local development server with live reload
# Usage: ./serve.sh [port]

PORT=${1:-8000}

echo "🚀 Starting MkDocs development server..."
echo "📍 URL: http://localhost:$PORT"
echo "⚡ Live reload enabled"
echo ""
echo "Press Ctrl+C to stop"
echo ""

mkdocs serve -a localhost:$PORT
