# Certification Tracker

A full-stack web application for tracking and managing professional certifications. The platform allows users to record certification details, track expiration dates, facilitate renewal processes, and store certificates for easy access and verification.

## Features

### Admin Features
- Manage all certification records across all users
- Track expiration dates system-wide
- Facilitate renewal processes
- View and manage user accounts

### User Features
- Record and manage personal certifications
- Monitor renewal deadlines with automatic alerts
- Upload and access certificate files
- View expiring certifications dashboard

## Tech Stack

- **Backend**: Node.js, Express.js, SQLite
- **Frontend**: React, React Router, Vite
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Styling**: CSS3 with modern gradients and responsive design

## Project Structure

```
proj/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── certifications.js
│   │   └── users.js
│   ├── uploads/
│   │   └── certificates/
│   ├── data/
│   │   └── certifications.db
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are provided):
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Credentials

A default admin account is automatically created:

- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change the default admin password in production!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Certifications
- `GET /api/certifications` - Get all certifications (user's own or all if admin)
- `GET /api/certifications/:id` - Get certification by ID
- `POST /api/certifications` - Create new certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification
- `GET /api/certifications/expiring/soon` - Get certifications expiring within 30 days

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/certifications` - Get user's certifications

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Dashboard**: View statistics and expiring certifications
3. **Add Certification**: Click "Add New Certification" to record a new certification
4. **Manage Certifications**: View, edit, or delete certifications from the certifications list
5. **Upload Certificates**: Attach certificate files (PDF, JPEG, PNG) when creating or editing certifications
6. **Monitor Expirations**: The dashboard automatically highlights certifications expiring within 30 days

## Features in Detail

### Certification Management
- Record certification name, issuer, issue date, and expiration date
- Upload certificate files (images or PDFs)
- Add notes and set status (active, expired, revoked, pending)
- Automatic expiration tracking and alerts

### Admin Features
- View all certifications from all users
- Manage user accounts
- System-wide expiration tracking
- Facilitate renewals

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/User)
- File upload validation

## Development

### Backend Development
- Uses SQLite for easy setup (no database server required)
- Database is automatically initialized on first run
- File uploads stored in `backend/uploads/certificates/`

### Frontend Development
- React with functional components and hooks
- Context API for state management
- Responsive design for mobile and desktop
- Modern UI with gradient backgrounds and smooth animations

## Production Deployment

Before deploying to production:

1. Change the default admin password
2. Set a strong `JWT_SECRET` in the `.env` file
3. Use a production database (PostgreSQL, MySQL) instead of SQLite
4. Configure proper file storage (AWS S3, etc.) for certificate files
5. Set up HTTPS
6. Configure CORS properly for your domain
7. Build the frontend: `cd frontend && npm run build`

## License

This project is open source and available for use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

