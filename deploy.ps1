# Deployment Script for Certification Tracker (PowerShell)
# This script helps prepare and deploy your application

Write-Host "🚀 Certification Tracker - Deployment Helper" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a repository on GitHub.com"
    Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    Write-Host "3. Run: git push -u origin main"
    Write-Host ""
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "📝 Creating .env file for backend..." -ForegroundColor Yellow
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    @"
PORT=5000
NODE_ENV=production
JWT_SECRET=$jwtSecret
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Host "✅ Created backend/.env file" -ForegroundColor Green
} else {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
}

# Check if frontend .env exists
if (-not (Test-Path "frontend\.env")) {
    Write-Host "📝 Creating .env file for frontend..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost:5000
"@ | Out-File -FilePath "frontend\.env" -Encoding utf8
    Write-Host "✅ Created frontend/.env file" -ForegroundColor Green
    Write-Host "⚠️  Remember to update VITE_API_URL with your backend URL after deployment" -ForegroundColor Yellow
} else {
    Write-Host "✅ Frontend .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Project is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Railway: https://railway.app (Recommended - Easiest)"
Write-Host "2. Render: https://render.com"
Write-Host "3. Vercel (Frontend) + Railway/Render (Backend)"
Write-Host ""
Write-Host "📖 See DEPLOY_NOW.md for detailed instructions" -ForegroundColor Cyan

