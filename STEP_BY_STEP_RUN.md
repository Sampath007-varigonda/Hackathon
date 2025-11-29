# Step-by-Step Guide to Run the Application

## 📋 Prerequisites
- Node.js installed (download from nodejs.org if not installed)
- A terminal/command prompt

---

## 🚀 STEP 1: Open Terminal

**Windows:**
- Press `Win + X` and select "Windows PowerShell" or "Terminal"
- Or search for "PowerShell" in Start menu

**Mac/Linux:**
- Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
- Type "Terminal" and press Enter

---

## 📂 STEP 2: Navigate to Project Folder

In your terminal, type:

```bash
cd "C:\Users\Varigonda Sampath\Downloads\proj"
```

Press Enter.

**Verify you're in the right folder:**
```bash
dir
```
You should see `backend` and `frontend` folders.

---

## 📦 STEP 3: Install Backend Dependencies

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install packages:
   ```bash
   npm install
   ```

3. **Wait for it to finish** (1-2 minutes)
   - You'll see: "added X packages"
   - Don't close the terminal!

---

## 📦 STEP 4: Install Frontend Dependencies

**Open a NEW terminal window** (keep the first one open):

1. Navigate to project folder:
   ```bash
   cd "C:\Users\Varigonda Sampath\Downloads\proj"
   ```

2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

3. Install packages:
   ```bash
   npm install
   ```

4. **Wait for it to finish** (1-2 minutes)

---

## 👤 STEP 5: Create Admin User

In the **first terminal** (backend folder):

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

## 🔧 STEP 6: Start Backend Server

**In the first terminal** (make sure you're in `backend` folder):

```bash
npm start
```

**You should see:**
```
Connected to SQLite database
Server running on port 5000
```

**⚠️ IMPORTANT: Keep this terminal window open!**

---

## 🎨 STEP 7: Start Frontend Server

**In the second terminal** (make sure you're in `frontend` folder):

```bash
npm run dev
```

**You should see:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**⚠️ IMPORTANT: Keep this terminal window open too!**

---

## 🌐 STEP 8: Open Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)

2. Go to this address:
   ```
   http://localhost:3000
   ```

3. You should see the **Login Page**

---

## 🔐 STEP 9: Login

**Option A: Login as Admin**
- Username: `admin`
- Password: `admin123`
- Click "Login"

**Option B: Register New User**
- Click "Register here"
- Fill in the form
- Click "Register"
- You'll be logged in automatically

---

## ✅ STEP 10: You're Done!

You should now see:
- ✅ Dashboard with statistics
- ✅ Navigation menu at the top
- ✅ Ability to manage certifications

---

## 📊 What You Can Do Now

### As Admin:
- View all certifications
- Approve/reject certification requests
- Create certifications directly
- Manage all users

### As Regular User:
- Submit certification requests
- View your request status
- View your approved certifications

---

## 🔄 Quick Reference

**Terminal 1 (Backend):**
```
cd backend
npm install          ← First time only
node scripts/create-admin.js  ← First time only
npm start            ← Keep running
```

**Terminal 2 (Frontend):**
```
cd frontend
npm install          ← First time only
npm run dev          ← Keep running
```

**Browser:**
- Go to: `http://localhost:3000`
- Login: `admin` / `admin123`

---

## ⚠️ Important Notes

1. **Keep both terminals open** while using the app
2. **First time setup** (npm install) only needed once
3. **If you see errors**, check both terminal windows
4. **Backend must be running** before frontend works

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure backend is running (Terminal 1)
- Check you see "Server running on port 5000"

### "Invalid credentials"
- Make sure you ran Step 5 (create admin)
- Try: `cd backend && node scripts/create-admin.js`

### Port already in use
- Backend: Change port in `backend/server.js` (line 11)
- Frontend: Vite will auto-use next available port

### Module not found
- Make sure you ran `npm install` in both folders
- Delete `node_modules` folder and run `npm install` again

---

## 🎯 Visual Summary

```
┌─────────────────────────────────────┐
│  Terminal 1 (Backend)                │
│  cd backend                          │
│  npm install                         │
│  node scripts/create-admin.js        │
│  npm start  ← Keep running          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Terminal 2 (Frontend)              │
│  cd frontend                         │
│  npm install                         │
│  npm run dev  ← Keep running        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Browser                             │
│  http://localhost:3000               │
│  Login: admin / admin123             │
└─────────────────────────────────────┘
```

---

## 📝 Checklist

- [ ] Node.js installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Admin user created
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Browser opened to localhost:3000
- [ ] Logged in successfully

---

**You're all set! Start exploring the application!** 🎉

