# LeaveIt – Hostel Leave Management System

*LeaveIt* is a web application designed to streamline hostel leave management for students, parents, and administrators. It provides an efficient platform to submit, track, and manage leave requests with a dual-approval workflow.

## Key Features

### User Roles

- *Students*: Submit and track leave requests.
- *Parents*: Review and approve/reject their children’s leave requests.
- *Administrators*: Provide final approval/rejection and manage system settings.

### Leave Management

- Multiple leave types: home leave, one-day leave, medical leave, etc.
- Date and time selection for leave periods.
- Leave status tracking: pending, approved, rejected.
- Dual approval system: parent and admin approval required.

## Technical Architecture

### Frontend

- *Framework*: React with TypeScript
- *Styling*: Tailwind CSS, shadcn/ui components
- *Routing*: React Router
- *State & Data Management*: React Context, React Query
- *Icons*: Lucide React
- *Date Handling*: date-fns

### Backend

- *Server*: Express.js
- *Database*: MongoDB with Mongoose
- *Authentication*: JWT-based authentication
- *API Design*: RESTful API with support for real and mock data

## Project Structure

### Authentication Components

- src/pages/Login.tsx – Login form
- src/pages/Register.tsx – Registration form
- src/contexts/AuthContext.tsx – Manages user authentication state
- src/components/ProtectedRoute.tsx – Route protection

### Dashboard Components

- src/pages/Dashboard.tsx – Main dashboard wrapper
- src/pages/StudentDashboard.tsx – Student interface
- src/pages/ParentDashboard.tsx – Parent interface
- src/pages/AdminDashboard.tsx – Admin interface

### UI Components

- src/components/DashboardHeader.tsx – Header and navigation
- src/components/LeaveTypeBadge.tsx – Leave type visual indicator
- src/components/ui/ – Shared UI components (buttons, cards, inputs, modals)

### State Management

- src/contexts/AuthContext.tsx – Auth state and login/logout logic
- src/contexts/LeaveContext.tsx – Leave data fetching and updates

### Backend Components

- src/backend/server.js – Express server configuration
- src/backend/routes/auth.js – Authentication APIs
- src/backend/routes/leave.js – Leave management APIs
- src/backend/models/User.js – User model
- src/backend/models/LeaveRequest.js – Leave request model

### Entry Points

- src/main.tsx – App entry point
- src/App.tsx – Application routes
- src/pages/Index.tsx – Public landing page

## Running the Application

### Prerequisites

- Node.js and npm installed
- MongoDB connection (configure in .env files)

### Start Frontend

```bash
cd hostel-leave-ninja
npm install
npm run dev
