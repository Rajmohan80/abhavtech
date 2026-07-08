#!/bin/bash
# validate.sh — Strict build validation
# Usage: ./validate.sh

echo "🔍 Running MkDocs strict validation..."
echo ""

if mkdocs build --strict; then
    echo ""
    echo "✅ BUILD VALIDATION PASSED"
    echo "   Zero warnings detected"
    echo "   Site is ready for deployment"
    exit 0
else
    echo ""
    echo "❌ BUILD VALIDATION FAILED"
    echo "   Fix all warnings before deploying"
    exit 1
fi
