#!/bin/bash
# Local deployment script - Run from your computer

# Configuration
SERVER="root@8.213.84.249"
KEY_PATH=/Users/mohammadshahzeb/.ssh/qwh-key.pem
PROJECT_PATH="/Users/mohammadshahzeb/QWH/qwh-frontend"

echo "🚀 Starting frontend deployment..."

# Navigate to project
cd "$PROJECT_PATH"

# Push to GitHub (optional)
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Update frontend - $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

# Build the app
echo "🏗️ Building React app..."
npm run build

# Compress
echo "📦 Creating archive..."
tar -czf dist.tar.gz dist/

# Upload
echo "📤 Uploading to server..."
scp -i "$KEY_PATH" dist.tar.gz "$SERVER:/tmp/"

# Deploy on server
echo "🚀 Deploying on server..."
ssh -i "$KEY_PATH" "$SERVER" "sudo /usr/local/bin/deploy-frontend.sh"

# Clean up local
rm dist.tar.gz

echo "✅ Deployment complete! Visit: http://8.213.84.249"