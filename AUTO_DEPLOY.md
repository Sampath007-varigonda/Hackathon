# 🚀 Automatic Deployment Guide

## ⚡ Fastest Way to Get Your App Live

### Step 1: Prepare Your Code (2 minutes)

Run this command in PowerShell:
```powershell
.\prepare-deploy.ps1
```

This will:
- ✅ Initialize Git repository
- ✅ Stage all files
- ✅ Prepare for deployment

### Step 2: Push to GitHub (3 minutes)

**If you don't have a GitHub account:**
1. Go to [github.com](https://github.com) and sign up (free)

**Create a new repository:**
1. Click the **"+"** button → **"New repository"**
2. Name it: `certification-tracker`
3. Make it **Public** (or Private, your choice)
4. **Don't** initialize with README
5. Click **"Create repository"**

**Push your code:**
```powershell
git commit -m "Initial commit - Certification Tracker"
git remote add origin https://github.com/YOUR_USERNAME/certification-tracker.git
git push -u origin main
```
(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 3: Deploy on Railway (5 minutes)

1. **Go to [railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. Authorize Railway (click "Authorize Railway")
5. Select your `certification-tracker` repository
6. Railway will start deploying automatically

**Configure Backend:**
1. Click on the service that was created
2. Go to **Settings** tab:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Go to **Variables** tab, add:
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=change-this-to-random-string-12345
   ```
4. Go to **Settings** → **Generate Domain**
5. **Copy the URL** (looks like: `https://xxxxx.railway.app`)

**Configure Frontend:**
1. In the same Railway project, click **"+ New"**
2. Click **"GitHub Repo"**
3. Select the same repository
4. Go to **Settings**:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`
5. Go to **Variables**, add:
   ```
   VITE_API_URL=https://xxxxx.railway.app
   ```
   (Use the backend URL from above)
6. Go to **Settings** → **Generate Domain**
7. **Copy this URL** - This is your live app!

### Step 4: Create Admin User

1. Click on your **backend** service in Railway
2. Click **"Deployments"** tab
3. Click the latest deployment
4. Click **"View Logs"** → **"Shell"** tab
5. Run:
   ```bash
   cd backend
   node scripts/fix-admin-simple.js
   ```

### Step 5: Access Your Live App! 🎉

1. Open the **frontend URL** in your browser
2. Click **"Admin Interface"**
3. Login:
   - Username: `@admin`
   - Password: `admin123`

**🎊 Your app is now live on the internet!**

---

## 🔗 Your URLs

After deployment:
- **Frontend (Your App):** `https://xxxxx.railway.app`
- **Backend API:** `https://yyyyy.railway.app`

---

## 🆘 Quick Troubleshooting

**Build failed?**
- Check Root Directory is set correctly
- Make sure all files are pushed to GitHub

**Can't connect to API?**
- Verify `VITE_API_URL` matches backend URL
- Check backend is running (green status)

**Login not working?**
- Run admin creation script in backend shell

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Railway
- [ ] Environment variables set
- [ ] Admin user created
- [ ] App tested

**Total time: ~10 minutes**

---

**Need help? Railway has 24/7 support in their Discord!**
