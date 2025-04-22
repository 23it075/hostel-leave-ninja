# Welcome to your Lovable project
 # LeaveIt – Hostel Leave Management System
 
 ## Project info
 *LeaveIt* is a web application designed to streamline hostel leave management for students, parents, and administrators. It provides an efficient platform to submit, track, and manage leave requests with a dual-approval workflow.
 
 **URL**: https://lovable.dev/projects/bc4d0ae7-e892-49f2-8636-de41261dec5c
 ## Key Features
 
 ## How can I edit this code?
 ### User Roles
 
 There are several ways of editing your application.
 - *Students*: Submit and track leave requests.
 - *Parents*: Review and approve/reject their children’s leave requests.
 - *Administrators*: Provide final approval/rejection and manage system settings.
 
 **Use Lovable**
 ### Leave Management
 
 Simply visit the [Lovable Project](https://lovable.dev/projects/bc4d0ae7-e892-49f2-8636-de41261dec5c) and start prompting.
 - Multiple leave types: home leave, one-day leave, medical leave, etc.
 - Date and time selection for leave periods.
 - Leave status tracking: pending, approved, rejected.
 - Dual approval system: parent and admin approval required.
 
 Changes made via Lovable will be committed automatically to this repo.
 ## Technical Architecture
 
 **Use your preferred IDE**
 ### Frontend
 
 If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.
 - *Framework*: React with TypeScript
 - *Styling*: Tailwind CSS, shadcn/ui components
 - *Routing*: React Router
 - *State & Data Management*: React Context, React Query
 - *Icons*: Lucide React
 - *Date Handling*: date-fns
 
 The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
 ### Backend
 
 Follow these steps:
 - *Server*: Express.js
 - *Database*: MongoDB with Mongoose
 - *Authentication*: JWT-based authentication
 - *API Design*: RESTful API with support for real and mock data
 
 ```sh
 # Step 1: Clone the repository using the project's Git URL.
 git clone <YOUR_GIT_URL>
 ## Project Structure
 
 # Step 2: Navigate to the project directory.
 cd <YOUR_PROJECT_NAME>
 ### Authentication Components
 
 # Step 3: Install the necessary dependencies.
 npm i
 - src/pages/Login.tsx – Login form
 - src/pages/Register.tsx – Registration form
 - src/contexts/AuthContext.tsx – Manages user authentication state
 - src/components/ProtectedRoute.tsx – Route protection
 
 # Step 4: Start the development server with auto-reloading and an instant preview.
 npm run dev
 ```
 ### Dashboard Components
 
 - src/pages/Dashboard.tsx – Main dashboard wrapper
 - src/pages/StudentDashboard.tsx – Student interface
 - src/pages/ParentDashboard.tsx – Parent interface
 - src/pages/AdminDashboard.tsx – Admin interface
 
 ### UI Components
 
 **Edit a file directly in GitHub**
 - src/components/DashboardHeader.tsx – Header and navigation
 - src/components/LeaveTypeBadge.tsx – Leave type visual indicator
 - src/components/ui/ – Shared UI components (buttons, cards, inputs, modals)
 
 - Navigate to the desired file(s).
 - Click the "Edit" button (pencil icon) at the top right of the file view.
 - Make your changes and commit the changes.
 ### State Management
 
 **Use GitHub Codespaces**
 - src/contexts/AuthContext.tsx – Auth state and login/logout logic
 - src/contexts/LeaveContext.tsx – Leave data fetching and updates
 
 - Navigate to the main page of your repository.
 - Click on the "Code" button (green button) near the top right.
 - Select the "Codespaces" tab.
 - Click on "New codespace" to launch a new Codespace environment.
 - Edit files directly within the Codespace and commit and push your changes once you're done.
 ### Backend Components
 
 ## What technologies are used for this project?
 - src/backend/server.js – Express server configuration
 - src/backend/routes/auth.js – Authentication APIs
 - src/backend/routes/leave.js – Leave management APIs
 - src/backend/models/User.js – User model
 - src/backend/models/LeaveRequest.js – Leave request model
 
 This project is built with .
 ### Entry Points
 
 - Vite
 - TypeScript
 - React
 - shadcn-ui
 - Tailwind CSS
 - src/main.tsx – App entry point
 - src/App.tsx – Application routes
 - src/pages/Index.tsx – Public landing page
 
 ## How can I deploy this project?
 ## Running the Application
 
 Simply open [Lovable](https://lovable.dev/projects/bc4d0ae7-e892-49f2-8636-de41261dec5c) and click on Share -> Publish.
 ### Prerequisites
 
 ## I want to use a custom domain - is that possible?
 - Node.js and npm installed
 - MongoDB connection (configure in .env files)
 
 We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
 ### Start Frontend
 
 ```bash
 cd leaveit-frontend
 npm install
 npm run dev
