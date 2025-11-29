# Fix: ECONNREFUSED Error

## Problem
The frontend cannot connect to the backend server. Error: `ECONNREFUSED`

This means the **backend server is not running** or not accessible.

---

## ✅ Solution

### Step 1: Check if Backend is Running

Look at your **backend terminal**. You should see:
```
Server running on port 5000
Connected to SQLite database
```

**If you DON'T see this**, the backend is not running!

### Step 2: Start the Backend Server

1. Open a terminal
2. Navigate to backend folder:
   ```bash
   cd backend
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. You should see:
   ```
   Connected to SQLite database
   Server running on port 5000
   ```

### Step 3: Verify Backend is Running

1. Open your browser
2. Go to: `http://localhost:5000/api/health`
3. You should see: `{"status":"OK","message":"Server is running"}`

If you see this, the backend is working!

### Step 4: Refresh Frontend

1. Go back to `http://localhost:3000`
2. Refresh the page (F5)
3. The error should be gone!

---

## 🔍 Common Issues

### Issue 1: Backend Not Started
**Solution:** Start the backend server (see Step 2 above)

### Issue 2: Wrong Port
**Check:** Make sure backend is on port 5000
- Check `backend/server.js` line 11: `const PORT = process.env.PORT || 5000;`

### Issue 3: Port Already in Use
**Solution:** 
1. Find what's using port 5000
2. Stop it, or change backend port in `backend/server.js`
3. Update `frontend/vite.config.js` proxy target to match

### Issue 4: Backend Crashed
**Solution:**
1. Check backend terminal for error messages
2. Fix any errors
3. Restart backend server

---

## 📋 Quick Checklist

- [ ] Backend terminal is open
- [ ] Backend shows "Server running on port 5000"
- [ ] Can access `http://localhost:5000/api/health`
- [ ] Frontend terminal is open
- [ ] Frontend shows "Local: http://localhost:3000"
- [ ] Both terminals are running (not closed)

---

## 🚀 Correct Setup

You need **TWO terminals running**:

**Terminal 1 (Backend):**
```
cd backend
npm start
← Should show: "Server running on port 5000"
```

**Terminal 2 (Frontend):**
```
cd frontend
npm run dev
← Should show: "Local: http://localhost:3000"
```

**Both must be running at the same time!**

---

## 💡 Quick Fix

1. **Stop everything** (Ctrl+C in both terminals)
2. **Start backend first:**
   ```bash
   cd backend
   npm start
   ```
3. **Wait for "Server running on port 5000"**
4. **Then start frontend** (new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
5. **Open browser:** `http://localhost:3000`

---

The error will disappear once the backend is running! ✅

