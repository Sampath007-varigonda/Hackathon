# Fix: "Failed to approve request" Error

## Problem
When trying to approve a certification request, you get the error: "Failed to approve request"

## Solution

### Option 1: Run Database Migration (Recommended)

The database might be missing the `request_id` column. Run this command:

```bash
cd backend
node scripts/migrate-database.js
```

This will add the missing column if needed.

### Option 2: Restart Backend Server

The database initialization now automatically adds the `request_id` column. Simply restart your backend server:

1. Stop the backend server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   cd backend
   npm start
   ```

### Option 3: Delete and Recreate Database (If above doesn't work)

If you don't have important data, you can delete the database and let it recreate:

1. Stop the backend server
2. Delete the database file:
   ```bash
   cd backend
   del data\certifications.db
   ```
   (On Windows PowerShell, use: `Remove-Item data\certifications.db`)

3. Start the backend server again:
   ```bash
   npm start
   ```

The database will be recreated with the correct schema.

---

## What Was Fixed

1. ✅ Added better error handling to show actual error messages
2. ✅ Added automatic database migration on startup
3. ✅ Created migration script for manual fixes
4. ✅ Improved error messages in frontend

---

## After Fixing

1. Restart your backend server
2. Try approving a request again
3. You should now see more detailed error messages if something goes wrong
4. The approval should work correctly

---

## Still Having Issues?

Check the backend terminal for error messages. The improved error handling will now show:
- Database errors
- Column missing errors
- Unique constraint errors
- Other specific issues

Share the error message from the backend terminal for further help.

