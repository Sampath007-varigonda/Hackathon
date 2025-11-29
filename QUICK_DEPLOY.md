# Quick Deploy Guide - Get Your App Online in 5 Minutes

## 🚀 Easiest Option: Railway (Recommended)

Railway is the simplest way to deploy. Follow these steps:

### Step 1: Prepare Your Code

1. Make sure all your code is in a GitHub repository
2. If not, create one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and sign up (free)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect it's Node.js
5. Click on the service → Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Go to Variables tab, add:
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=change-this-to-random-string-12345
   ```
7. Click "Deploy" - Railway will give you a URL like: `https://your-app.railway.app`

### Step 3: Deploy Frontend on Railway

1. In the same Railway project, click "New" → "Static Site"
2. Connect the same GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`
4. Go to Variables tab, add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Use the backend URL from Step 2)
5. Deploy - Railway will give you a frontend URL

### Step 4: Create Admin User

1. In Railway, click on your backend service
2. Go to "Deployments" → Click on the latest deployment
3. Click "View Logs" → Open "Shell" tab
4. Run:
   ```bash
   cd backend
   node scripts/fix-admin-simple.js
   ```

### Step 5: Access Your App

- Visit the frontend URL Railway gave you
- Login with: `@admin` / `admin123`

---

## 🎯 Alternative: Render (Also Free)

### Backend:
1. Go to [render.com](https://render.com) and sign up
2. "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - **Name:** cert-tracker-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build:** `npm install`
   - **Start:** `npm start`
5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-secret-key
   ```
6. Deploy - Get URL

### Frontend:
1. "New" → "Static Site"
2. Connect same repo
3. Settings:
   - **Root Directory:** frontend
   - **Build:** `npm install && npm run build`
   - **Publish:** dist
4. Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
5. Deploy

---

## 📝 Important Notes

- **Free tiers** are available on both platforms
- **Database** (SQLite) will persist on the server
- **File uploads** will work automatically
- **HTTPS** is included automatically
- **Custom domain** can be added later

---

## 🔗 After Deployment

Your app will be live at:
- Frontend: `https://your-app.railway.app` or `https://your-app.onrender.com`
- Backend API: `https://your-backend.railway.app/api` or `https://your-backend.onrender.com/api`

---

## 🆘 Need Help?

If you get stuck:
1. Check the deployment logs in Railway/Render
2. Make sure environment variables are set correctly
3. Verify the backend URL is correct in frontend variables
4. Check that both services are deployed and running

