# Quick Start Guide - Certification Tracker

## 🚀 Complete Setup & Run Instructions

### STEP 1: Install Backend Dependencies

Open a terminal and run:

```bash
cd backend
npm install
```

Wait for installation to complete (1-2 minutes).

---

### STEP 2: Install Frontend Dependencies

Open a **NEW terminal** (or use the same one after Step 1):

```bash
cd frontend
npm install
```

Wait for installation to complete (1-2 minutes).

---

### STEP 3: Create Admin User

In your terminal, from the `proj` folder:

```bash
cd backend
node scripts/create-admin.js
```

You should see:
```
✅ Admin user created successfully!
Username: admin
Password: admin123
```

---

### STEP 4: Start Backend Server

Make sure you're in the `backend` folder:

```bash
npm start
```

You should see:
```
Connected to SQLite database
Server running on port 5000
```

**⚠️ Keep this terminal window open!**

---

### STEP 5: Start Frontend Server

Open a **NEW terminal window**:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**⚠️ Keep this terminal window open!**

---

### STEP 6: Open Application

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the login page

---

### STEP 7: Login

**Option A: Login as Admin**
- Username: `admin`
- Password: `admin123`
- You'll have full access including approval features

**Option B: Register New User**
- Click "Register here"
- Fill in the form
- You'll be logged in automatically
- You can submit certification requests (requires admin approval)

---

## ✅ You're Ready!

### What You Can Do Now:

**As Admin:**
- ✅ View all certifications
- ✅ Approve/reject certification requests
- ✅ Create certifications directly
- ✅ Manage all users

**As Regular User:**
- ✅ Submit certification requests
- ✅ View your requests status
- ✅ View your approved certifications
- ✅ Track pending approvals

---

## 📋 Quick Command Reference

**Terminal 1 (Backend):**
```bash
cd backend
npm install          # First time only
node scripts/create-admin.js  # First time only
npm start            # Keep running
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install          # First time only
npm run dev          # Keep running
```

**Browser:**
- Go to: `http://localhost:3000`
- Login: `admin` / `admin123`

---

## 🔄 New Request/Approval Workflow

### For Users:
1. Click "Submit Request" or go to "My Requests"
2. Fill in certification details
3. Submit request (gets unique Request ID)
4. Wait for admin approval
5. Check "My Requests" for status

### For Admins:
1. Go to "Requests" page
2. See all pending requests
3. Review and click "✓ Approve" or "✗ Reject"
4. Approved requests automatically create certifications

---

## ❓ Troubleshooting

### "Invalid credentials"
- Make sure you ran Step 3 (create admin user)
- Try: `cd backend && node scripts/create-admin.js`

### "Cannot connect to server"
- Make sure backend is running (Step 4)
- Check terminal shows "Server running on port 5000"

### Port already in use
- Backend: Change port in `backend/server.js` (line 11)
- Frontend: Vite will auto-use next available port

### Module not found errors
- Make sure you ran `npm install` in both folders
- Delete `node_modules` and run `npm install` again

---

## 🎯 First Time User Flow

1. **Login** as admin or register new user
2. **Dashboard** - See overview and stats
3. **Submit Request** (or "Add Certification" if admin)
4. **View Requests** - Track your submissions
5. **View Certifications** - See approved certifications

---

## 📝 Important Notes

- **Keep both terminals open** while using the app
- **First time setup** (npm install) only needed once
- **Admin credentials**: `admin` / `admin123`
- **Database** is created automatically on first run
- **Request IDs** are unique and permanent

---

## 🆘 Need Help?

1. Check both servers are running
2. Check browser console for errors (F12)
3. Check terminal output for errors
4. Make sure you're logged in
5. Try refreshing the page

---

**You're all set! Start by logging in and exploring the features!** 🎉

