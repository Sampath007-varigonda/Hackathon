# 🚀 DEPLOY YOUR APP - START HERE

## ✅ Your code is ready! Now follow these 3 steps:

---

## STEP 1: Push to GitHub (5 minutes)

### A. Create GitHub Repository
1. Go to **[github.com](https://github.com)** and sign up/login
2. Click **"+"** → **"New repository"**
3. Name: `certification-tracker`
4. Make it **Public**
5. **Don't** check "Initialize with README"
6. Click **"Create repository"**

### B. Push Your Code
Run these commands in PowerShell (in your project folder):

```powershell
git commit -m "Initial commit - Certification Tracker App"
git remote add origin https://github.com/YOUR_USERNAME/certification-tracker.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## STEP 2: Deploy on Railway (5 minutes)

### A. Sign Up
1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Sign up with GitHub (free, no credit card)

### B. Deploy Backend
1. Click **"Deploy from GitHub repo"**
2. Select your `certification-tracker` repository
3. Click on the service → **Settings**:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Go to **Variables** tab, add:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `my-secret-key-12345` (change this!)
5. **Settings** → **Generate Domain** → **Copy URL**

### C. Deploy Frontend
1. In same project, click **"+ New"** → **"GitHub Repo"**
2. Select same repository
3. **Settings**:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`
4. **Variables** tab:
   - `VITE_API_URL` = (paste backend URL from above)
5. **Settings** → **Generate Domain** → **Copy URL** ← **THIS IS YOUR LIVE APP!**

---

## STEP 3: Create Admin User (2 minutes)

1. Click **backend** service → **Deployments** → Latest deployment
2. Click **"View Logs"** → **"Shell"** tab
3. Run:
   ```bash
   cd backend
   node scripts/fix-admin-simple.js
   ```

---

## 🎉 DONE! Your App is Live!

Visit your frontend URL and login with:
- Username: `@admin`
- Password: `admin123`

---

## 📞 Need Help?

- **GitHub issues?** Check: https://docs.github.com
- **Railway issues?** Check: https://docs.railway.app
- **App not working?** Check Railway logs

---

## ⚡ Quick Commands Reference

```powershell
# Commit and push to GitHub
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/certification-tracker.git
git push -u origin main
```

**That's it! Your app will be live in ~10 minutes!** 🚀

