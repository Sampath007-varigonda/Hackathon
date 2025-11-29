#!/bin/bash

# Deployment Script for Certification Tracker
# This script helps prepare and deploy your application

echo "🚀 Certification Tracker - Deployment Helper"
echo "============================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo "✅ Git repository initialized"
    echo ""
    echo "⚠️  Next steps:"
    echo "1. Create a repository on GitHub.com"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "3. Run: git push -u origin main"
    echo ""
else
    echo "✅ Git repository already initialized"
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file for backend..."
    cat > backend/.env << EOF
PORT=5000
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 32)
EOF
    echo "✅ Created backend/.env file"
else
    echo "✅ Backend .env file exists"
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating .env file for frontend..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000
EOF
    echo "✅ Created frontend/.env file"
    echo "⚠️  Remember to update VITE_API_URL with your backend URL after deployment"
else
    echo "✅ Frontend .env file exists"
fi

echo ""
echo "✅ Project is ready for deployment!"
echo ""
echo "📋 Deployment Options:"
echo "1. Railway: https://railway.app (Recommended - Easiest)"
echo "2. Render: https://render.com"
echo "3. Vercel (Frontend) + Railway/Render (Backend)"
echo ""
echo "📖 See DEPLOY_NOW.md for detailed instructions"

