# Frontend Setup & Run Guide

## 🎨 Frontend Quick Start

### STEP 1: Navigate to Frontend Folder

Open a terminal and run:

```bash
cd "C:\Users\Varigonda Sampath\Downloads\proj\frontend"
```

Or if you're already in the `proj` folder:

```bash
cd frontend
```

---

### STEP 2: Install Dependencies (First Time Only)

```bash
npm install
```

**Wait for it to finish** (1-2 minutes)
- You'll see: "added X packages"
- This only needs to be done once

---

### STEP 3: Start Frontend Server

```bash
npm run dev
```

**You should see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

### STEP 4: Open in Browser

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the **Login Page**

---

## ⚠️ Important Notes

### Prerequisites
- **Backend must be running first!**
- Frontend connects to backend at `http://localhost:5000`
- If backend is not running, you'll see connection errors

### Keep Terminal Open
- **Don't close the terminal** while using the app
- The frontend server must keep running

---

## 🔄 Complete Setup (Both Servers)

You need **TWO terminals**:

**Terminal 1 (Backend):**
```bash
cd backend
npm install          # First time only
npm start           # Keep running
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install          # First time only
npm run dev          # Keep running
```

---

## 🐛 Troubleshooting

### "ECONNREFUSED" Error
- **Problem:** Backend is not running
- **Solution:** Start the backend server first (Terminal 1)

### "Port 3000 already in use"
- **Solution:** Vite will automatically use the next available port
- Check the terminal for the new port number (e.g., `http://localhost:3001`)

### "Module not found"
- **Solution:** Run `npm install` in the frontend folder
- Delete `node_modules` folder and run `npm install` again if needed

### Page shows "Cannot connect to server"
- **Check:** Is backend running on port 5000?
- **Verify:** Go to `http://localhost:5000/api/health` in browser
- Should see: `{"status":"OK","message":"Server is running"}`

---

## 📋 Frontend Commands

### Development Mode
```bash
npm run dev
```
- Starts development server
- Auto-reloads on file changes
- Runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
```
- Creates optimized production build
- Output in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
- Preview the production build locally

---

## 🎯 Quick Checklist

- [ ] Backend server is running (Terminal 1)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server started (`npm run dev`)
- [ ] Browser opened to `http://localhost:3000`
- [ ] No errors in frontend terminal

---

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── context/        # Auth context
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

---

## 🚀 What Happens When You Start

1. Vite starts the development server
2. Frontend runs on `http://localhost:3000`
3. Proxy forwards `/api/*` requests to `http://localhost:5000`
4. React app loads in browser
5. App tries to connect to backend API

---

## ✅ Success Indicators

**Frontend Terminal Shows:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**Browser Shows:**
- Login page (if not logged in)
- Dashboard (if logged in)

**No Errors:**
- No red errors in browser console (F12)
- No connection errors in frontend terminal

---

**Your frontend is ready!** 🎉

