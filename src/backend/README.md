
# Hostel Leave Management System Backend

This is the backend for the Hostel Leave Management System, built with Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed locally or a MongoDB Atlas account

### Installation

1. Install dependencies:
```
cd src/backend
npm install
```

2. Configure Environment Variables:
- Create a `.env` file in the root directory based on the sample provided
- Update the `MONGO_URI` with your MongoDB connection string
- Set a secure `JWT_SECRET` for token generation

3. Start the server:
```
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on port 5000 by default (http://localhost:5000).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user profile (requires authentication)

### Leave Requests
- `POST /api/leave` - Create a new leave request (students only)
- `GET /api/leave` - Get leave requests based on user role
- `GET /api/leave/:id` - Get a specific leave request
- `PUT /api/leave/:id` - Update leave request status (parents and admins only)

## MongoDB Setup

If you're using MongoDB locally, make sure to start the MongoDB service:
```
# On Linux
sudo systemctl start mongod

# On macOS (if installed with Homebrew)
brew services start mongodb-community
```

For MongoDB Atlas, update the `MONGO_URI` in your `.env` file with your connection string.
