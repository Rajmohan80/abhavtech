#!/bin/bash
# deploy-cloudflare.sh — Deploy to Cloudflare Pages via Git
# Usage: ./deploy-cloudflare.sh "commit message"

if [ -z "$1" ]; then
    echo "❌ Error: Commit message required"
    echo "Usage: ./deploy-cloudflare.sh \"your commit message\""
    exit 1
fi

COMMIT_MSG="$1"

echo "🔍 Running validation before deployment..."
if ! ./validate.sh > /dev/null 2>&1; then
    echo "❌ Validation failed. Fix errors before deploying."
    exit 1
fi

echo "✅ Validation passed"
echo ""
echo "📦 Preparing deployment..."

# Add all changes
git add .

# Commit
git commit -m "$COMMIT_MSG"

# Push to main branch (triggers Cloudflare Pages deployment)
echo "🚀 Pushing to GitHub (triggers Cloudflare Pages)..."
git push origin main

echo ""
echo "✅ DEPLOYMENT INITIATED"
echo "   Monitor progress at: https://dash.cloudflare.com"
echo "   Site will be live in 2-3 minutes"
