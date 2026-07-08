#!/bin/bash
# validate.sh - Build validation with strict error checking

set -e

echo "======================================"
echo "  MkDocs Build Validation"
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
echo "Running mkdocs build --strict..."
echo ""

if mkdocs build --strict; then
    echo ""
    echo "======================================"
    echo "  ✅ BUILD SUCCESSFUL"
    echo "======================================"
    echo ""
    echo "Static site generated in: ./site/"
    echo ""
    exit 0
else
    echo ""
    echo "======================================"
    echo "  ❌ BUILD FAILED"
    echo "======================================"
    echo ""
    echo "Fix errors above and run ./validate.sh again"
    echo ""
    exit 1
fi
