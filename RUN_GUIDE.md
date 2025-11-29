# Complete Step-by-Step Guide to Run the Application

## Prerequisites
- Node.js installed on your computer
- npm (comes with Node.js)

---

## STEP 1: Install Backend Dependencies

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install all required packages:
   ```bash
   npm install
   ```
4. Wait for installation to complete (this may take 1-2 minutes)
5. You should see a message like "added X packages"

---

## STEP 2: Install Frontend Dependencies

1. Open a NEW terminal/command prompt (or use the same one after Step 1)
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install all required packages:
   ```bash
   npm install
   ```
4. Wait for installation to complete (this may take 1-2 minutes)

---

## STEP 3: Create Admin User

1. In your terminal, make sure you're in the `proj` folder
2. Navigate to backend:
   ```bash
   cd backend
   ```
3. Run the admin creation script:
   ```bash
   node scripts/create-admin.js
   ```
4. You should see:
   ```
   ✅ Admin user created successfully!
   Username: admin
   Password: admin123
   ```

---

## STEP 4: Start the Backend Server

1. Make sure you're in the `backend` folder
2. Start the server:
   ```bash
   npm start
   ```
3. You should see:
   ```
   Connected to SQLite database
   Server running on port 5000
   ```
4. **Keep this terminal window open** - the server must keep running

---

## STEP 5: Start the Frontend Server

1. Open a **NEW terminal window** (keep the backend terminal running)
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```
5. **Keep this terminal window open** - the frontend must keep running

---

## STEP 6: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: `http://localhost:3000`
3. You should see the login page

---

## STEP 7: Login

1. On the login page, enter:
   - **Username:** `admin`
   - **Password:** `admin123`
2. Click the "Login" button
3. You should be redirected to the dashboard

---

## ✅ You're Done!

You should now see:
- A dashboard with statistics
- Navigation menu at the top
- Ability to add and manage certifications

---

## Troubleshooting

### If you see "Invalid credentials":
1. Make sure you ran Step 3 (create admin user)
2. Make sure the backend server is running (Step 4)
3. Try registering a new account instead

### If port 5000 is already in use:
- Stop any other application using port 5000
- Or change the port in `backend/server.js` (line 11)

### If port 3000 is already in use:
- The frontend will automatically use a different port
- Check the terminal for the new port number

### If you see "Cannot connect to server":
- Make sure the backend server is running (Step 4)
- Check that you see "Server running on port 5000" in the backend terminal

---

## Quick Reference Commands

**Terminal 1 (Backend):**
```bash
cd backend
npm install
node scripts/create-admin.js
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

**Browser:**
- Go to: `http://localhost:3000`
- Login: `admin` / `admin123`

