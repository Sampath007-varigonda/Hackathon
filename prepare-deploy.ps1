# Deployment Preparation Script
Write-Host "🚀 Preparing project for deployment..." -ForegroundColor Green

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Initialize git if not already
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Create .gitkeep for uploads directory
$uploadsDir = "backend/uploads"
if (Test-Path $uploadsDir) {
    $gitkeep = Join-Path $uploadsDir ".gitkeep"
    if (-not (Test-Path $gitkeep)) {
        New-Item -ItemType File -Path $gitkeep -Force | Out-Null
        Write-Host "✅ Created .gitkeep for uploads directory" -ForegroundColor Green
    }
}

# Check if files are staged
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Staging files for commit..." -ForegroundColor Yellow
    git add .
    Write-Host "✅ Files staged" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a GitHub repository at https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Run: git commit -m 'Initial commit'" -ForegroundColor Cyan
    Write-Host "3. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
    Write-Host "4. Run: git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then go to https://railway.app and deploy!" -ForegroundColor Green
} else {
    Write-Host "✅ All files are already committed" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to deploy! Go to https://railway.app" -ForegroundColor Green
}

Write-Host ""
Write-Host "📚 See DEPLOY_NOW.md for detailed instructions" -ForegroundColor Cyan

