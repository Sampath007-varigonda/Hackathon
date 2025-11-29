# User Guide - Certification Tracker

## Welcome to Certification Tracker! 📜

This guide will help you understand how to use the application from a user's perspective.

---

## 🚀 Getting Started

### First Time Login

1. **Open your browser** and go to: `http://localhost:3000`

2. **Login Page** - You'll see a login form with:
   - Username/Email field
   - Password field
   - "Login" button
   - "Register here" link

3. **Two Options:**

   **Option A: Login as Admin**
   - Username: `admin`
   - Password: `admin123`
   - You'll have access to all features + admin features

   **Option B: Register New Account**
   - Click "Register here"
   - Fill in:
     - Username (choose any)
     - Email (your email)
     - Password (at least 6 characters)
     - Confirm Password
   - Click "Register"
   - You'll be automatically logged in

---

## 📊 Dashboard (Home Page)

After logging in, you'll see the **Dashboard** with:

### Statistics Cards (Top Section)
- **Total Certifications** - Number of all your certifications
- **Active Certifications** - Currently active certifications
- **Expiring Soon** - Certifications expiring within 30 days (highlighted in yellow/orange)
- **Expired Certifications** - Certifications that have expired (highlighted in red)

### Expiring Certifications Alert
- If you have certifications expiring within 30 days, you'll see a warning section
- Shows:
  - Certification name
  - Issuer
  - Expiration date
  - Days remaining (highlighted in red if less than 7 days)
  - "Renew" button to quickly update the certification

### Quick Actions
- **View All Certifications** - Go to your certifications list
- **Add Certification** - Record a new certification
- **Admin Panel** (Admin only) - Manage all users and certifications

---

## 📋 My Certifications Page

### Viewing Your Certifications

1. Click **"My Certifications"** in the navigation menu
2. You'll see all your certifications displayed as cards

### Each Certification Card Shows:
- **Certification Name** (e.g., "AWS Certified Solutions Architect")
- **Status Badge:**
  - 🟢 Green "Active" - Valid and not expiring soon
  - 🟡 Yellow "X days left" - Expiring within 30 days
  - 🔴 Red "Expired" - Past expiration date
  - 🔵 Blue "No Expiration" - No expiration date set
- **Issuer** (e.g., "Amazon Web Services")
- **Issue Date** - When you received the certification
- **Expiration Date** - When it expires (if applicable)
- **Notes** - Any additional information you added
- **Action Buttons:**
  - **View Certificate** - Opens the uploaded certificate file
  - **Edit** - Modify certification details
  - **Delete** - Remove the certification

---

## ➕ Adding a New Certification

1. Click **"+ Add New Certification"** button (from dashboard or certifications page)

2. Fill in the form:
   - **Certification Name*** (Required)
     - Example: "AWS Certified Solutions Architect"
   - **Issuer*** (Required)
     - Example: "Amazon Web Services"
   - **Issue Date*** (Required)
     - Select the date you received the certification
   - **Expiration Date** (Optional)
     - Leave empty if the certification doesn't expire
     - Select date if it has an expiration
   - **Status** (Dropdown)
     - Active (default)
     - Expired
     - Revoked
     - Pending
   - **Certificate File** (Optional)
     - Click to upload a PDF, JPEG, or PNG file
     - Maximum file size: 10MB
     - This is the actual certificate document
   - **Notes** (Optional)
     - Add any additional information
     - Example: "Renewal required every 3 years"

3. Click **"Create Certification"**

4. You'll be redirected to the certifications list with your new certification

---

## ✏️ Editing a Certification

1. Go to **"My Certifications"** page
2. Find the certification you want to edit
3. Click the **"Edit"** button on that certification card
4. Update any fields you want to change:
   - You can change the name, issuer, dates, status, notes
   - You can upload a new certificate file (replaces the old one)
5. Click **"Update Certification"**
6. Changes are saved immediately

---

## 🗑️ Deleting a Certification

1. Go to **"My Certifications"** page
2. Find the certification you want to delete
3. Click the **"Delete"** button
4. Confirm the deletion in the popup
5. The certification and its file (if uploaded) will be permanently deleted

---

## 📄 Viewing Certificate Files

1. Go to **"My Certifications"** page
2. Find a certification that has a file uploaded
3. Click the **"View Certificate"** button
4. The certificate file will open in a new browser tab
5. You can download or print it from there

---

## ⚠️ Monitoring Expiration Dates

### Automatic Alerts

The system automatically tracks certifications expiring within **30 days**:

- **Dashboard** shows a warning section with expiring certifications
- **Certification cards** show status badges:
  - Yellow badge: "X days left" (expiring soon)
  - Red badge: "Expired" (past expiration date)

### What to Do When a Certification is Expiring

1. Check the **Dashboard** for expiring certifications
2. Click **"Renew"** button on the expiring certification
3. Update the **Expiration Date** to the new expiration date
4. Upload a new certificate file if you received one
5. Update the **Status** if needed
6. Click **"Update Certification"**

---

## 👑 Admin Features (Admin Users Only)

If you're logged in as an admin, you have additional features:

### View All Certifications
- See certifications from **all users** in the system
- Each certification shows which user owns it
- Can edit or delete any certification

### User Management
- View all registered users
- See each user's certifications
- Manage user accounts

### System-Wide Tracking
- Track all expiring certifications across all users
- Monitor certification statuses system-wide

---

## 🔐 Account Management

### Logout
1. Click your **username** in the top navigation
2. Click the **"Logout"** button
3. You'll be redirected to the login page

### View Profile
- Your username and role are displayed in the navigation bar
- Admin users see "(Admin)" next to their username

---

## 💡 Tips for Best Experience

1. **Upload Certificate Files**: Always upload the actual certificate PDF/image for easy access later

2. **Set Expiration Dates**: Even if a certification doesn't expire, you can leave the expiration date empty

3. **Use Notes**: Add important information in the notes field, like:
   - Renewal requirements
   - Contact information for renewal
   - Special conditions

4. **Check Dashboard Regularly**: The dashboard shows expiring certifications, so check it often

5. **Keep Information Updated**: Update certifications when you renew them or if details change

---

## 🎯 Common Tasks

### Task: Add Your First Certification
1. Login → Dashboard → Click "+ Add New Certification"
2. Fill in the form → Upload certificate file → Save

### Task: Check What's Expiring Soon
1. Login → Dashboard
2. Look at the "Expiring Soon" section
3. Click "Renew" on any expiring certification

### Task: Find a Specific Certification
1. Login → Click "My Certifications"
2. Scroll through your certifications
3. Use browser search (Ctrl+F) to find by name

### Task: Update an Expired Certification
1. Login → "My Certifications"
2. Find the expired certification (red badge)
3. Click "Edit"
4. Update expiration date and status
5. Save

---

## ❓ Need Help?

- Make sure both backend and frontend servers are running
- Check that you're logged in
- Try refreshing the page if something doesn't load
- Logout and login again if you encounter issues

---

## 🎉 You're All Set!

You now know how to use the Certification Tracker. Start by adding your first certification and explore all the features!

