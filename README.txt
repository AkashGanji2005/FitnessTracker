FitTrack - MERN Stack Fitness Web Application
CIS 4004 - Term Project - Spring 2026

=====================================
PREREQUISITES
=====================================
Make sure the following are installed before running the application:
  - Node.js (v18 or higher): https://nodejs.org
  - MongoDB Community Edition (running locally on default port 27017): https://www.mongodb.com/try/download/community
  - npm (comes with Node.js)

To verify MongoDB is running, open a terminal and run:
  mongod --version

If MongoDB is not running, start it using one of the following depending on your OS:

  macOS (Homebrew):
    brew services start mongodb-community

  Windows:
    Open Services (services.msc) and start "MongoDB", or run:
    net start MongoDB

  Linux:
    sudo systemctl start mongod

MongoDB must be running on localhost at the default port 27017 before starting the application.

=====================================
STEP 1 — INSTALL DEPENDENCIES
=====================================
From the root project folder, run:
  npm install

Then navigate into the client folder and install frontend dependencies:
  cd client
  npm install
  cd ..

=====================================
STEP 2 — SEED THE DATABASE
=====================================
From the root project folder, run:
  node seed.js

This will:
  - Populate the exercises collection with 10 pre-defined exercises
  - Create a default admin account

Default admin credentials:
  Username: admin
  Password: admin123

WARNING: seed.js clears the users and exercises collections before inserting.
Only run it once before grading, not again after users have been created.

=====================================
STEP 3 — START THE WEB SERVER
=====================================
From the root project folder, run:
  node server.js

The backend API will start on port 3001.
You should see:
  Server running on port 3001
  MongoDB Connected

=====================================
STEP 4 — START THE REACT APPLICATION
=====================================
In a second terminal, navigate to the client folder and run:
  cd client
  npm run dev

The React frontend will start on port 5173.
You should see:
  VITE ready in ...ms
  Local: http://localhost:5173/

=====================================
HOW TO NAVIGATE TO THE APPLICATION
=====================================
Open a browser and go to:
  http://localhost:5173

The application will load directly on the login page.

To log in as admin:
  Username: admin
  Password: admin123

To create a standard user account, click "Sign Up" on the login page.

=====================================
MONGODB COLLECTIONS
=====================================
The application uses the following 5 collections in a database named "fittrack":

  1. users          — stores user accounts (username, hashed password, role, weight)
  2. workoutsessions — stores workout sessions (user, date, duration)
  3. exercises       — stores exercise definitions (name, type, MET value, muscle groups)
  4. dailylogs       — stores individual exercise log entries (session, exercise, sets, reps, calories)
  5. goals           — stores user fitness goals (type, target, current progress, deadline, status)

The database and collections are created automatically by MongoDB when the app first runs.
No manual setup of collections is required beyond running seed.js.

=====================================
APPLICATION OVERVIEW
=====================================
FitTrack is a fitness tracking web application. Users can:
  - Log cardio workouts (duration-based calorie calculation using MET formula)
  - Log strength workouts (sets/reps-based calorie calculation)
  - Set and track fitness goals with progress bars
  - View a dashboard with daily and weekly stats

Admins can additionally:
  - View all users and all workout logs
  - Create, update, and delete user accounts

=====================================
PORT SUMMARY
=====================================
  Backend API:      http://localhost:3001
  Frontend (React): http://localhost:5173

updated by Devin
