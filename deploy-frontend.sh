#!/bin/bash
# Local deployment script - Run from your computer

# Configuration
SERVER="root@8.213.84.249"
KEY_PATH=/Users/mohammadshahzeb/.ssh/qwh-key.pem
PROJECT_PATH="/Users/mohammadshahzeb/QWH/qwh-frontend"

echo "🚀 Starting frontend deployment..."

cd "$PROJECT_PATH" || { echo "❌ Project path not found!"; exit 1; }

# Clean old files
echo "🧹 Cleaning old build..."
rm -rf dist
rm -f dist.tar.gz

# Git push (optional - comment out if not needed)
echo "📤 Pushing to GitHub..."
git add . 2>/dev/null
git commit -m "Update frontend - $(date +'%Y-%m-%d %H:%M:%S')" 2>/dev/null
git push origin main 2>/dev/null

# Build
echo "🏗️ Building React app..."
npm run build

# Verify
if [ ! -d "dist" ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Archive and upload
echo "📦 Creating and uploading archive..."
tar -czf dist.tar.gz dist/
scp -i "$KEY_PATH" dist.tar.gz "$SERVER:/tmp/"

# Deploy
echo "🚀 Deploying on server..."
ssh -i "$KEY_PATH" "$SERVER" "sudo /usr/local/bin/deploy-frontend.sh"

# Clean archive, keep dist for inspection
rm -f dist.tar.gz

echo "✅ Deployment complete! Visit: http://8.213.84.249"
echo "📁 Build files preserved in ./dist for inspection"