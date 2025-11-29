# Quick Setup Guide

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 3: Start the Backend Server

From the `backend` directory:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Step 4: Start the Frontend Server

From the `frontend` directory (in a new terminal):
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Step 5: Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Login with default admin credentials:
   - Username: `admin`
   - Password: `admin123`
3. Or register a new user account

## Default Admin Account

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@example.com`

**⚠️ Important**: Change the default admin password in production!

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Change `PORT` in `backend/.env` or `backend/server.js`
- Frontend: Change port in `frontend/vite.config.js`

### Database Issues
The SQLite database is automatically created on first run in `backend/data/certifications.db`

### File Upload Issues
Make sure the `backend/uploads/certificates/` directory exists and has write permissions.

## Next Steps

- Add your certifications
- Upload certificate files
- Monitor expiration dates
- Use admin features to manage all certifications (if logged in as admin)

