#!/bin/bash
# serve.sh - Local development server with live reload

set -e

echo "======================================"
echo "  MkDocs Development Server"
echo "======================================"
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
echo "Installing/updating dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1

echo ""
echo "Starting MkDocs server..."
echo "Access documentation at: http://127.0.0.1:8000"
echo "Press Ctrl+C to stop"
echo ""

mkdocs serve
