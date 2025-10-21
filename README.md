GigConnect - Full Stack Freelancer Platform

GigConnect is a full-stack web application that connects freelancers with clients. Clients can post gigs, and freelancers can create profiles, browse available gigs, and apply. The project is built using React, Node.js/Express, and MongoDB.

Table of Contents

Features
--Tech Stack
--Frontend Setup
--Backend Setup
--Database Setup
--Folder Structure

Usage

--Future Enhancements
--Features Freelancer
--Register/login and create profile
--Update profile with skills, experience, and location
--Browse available gigs

Apply to gigs

--View applied gigs and status
--Client
--Register/login
--Post new gigs
--View applications for posted gigs
--Track gig status (open, in-progress, completed)

Admin

--Manage users (freelancers/clients)
--Moderate gigs and applications
--Tech Stack

Frontend

--React.js (with React Router)
--Bootstrap 5 & custom CSS for styling

Axios for API requests

--Context API for state management

Backend

--Node.js & Express.js
--MongoDB (database)
--Mongoose (MongoDB ODM)
--JWT Authentication
--bcrypt for password hashing
--CORS

Database

--MongoDB Atlas (cloud-based database)
--Collections:
--users → stores freelancers, clients, admin accounts
--profiles → freelancer profiles
--gigs → client gigs and applications

Frontend Setup

Navigate to frontend folder:

---cd gigconnect-frontend


Install dependencies:

---npm install


Start development server:

---npm start


App will run at: http://localhost:3000

Environment Variables:
Create .env file if needed:

---REACT_APP_API_BASE_URL=http://localhost:5000/api

Backend Setup

Navigate to backend folder:

---cd gigconnect-backend


Install dependencies:

---npm install


Environment Variables:
---Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


Start backend server:

---npm run dev


Backend API runs at: http://localhost:5000/api

Database Setup (MongoDB)

--Sign up for MongoDB Atlas
--Create a new cluster.
--Create a database named gigconnect.
--Create collections:
--users → Stores user info and hashed passwords
--profiles → Freelancer profiles
--gigs → Client gigs and applications
--Copy the connection string and update MONGO_URI in .env.

Folder Structure
Frontend
gigconnect-frontend/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── App.js
└── package.json

Backend
gigconnect-backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── server.js
└── package.json

Usage
--Register as freelancer or client
--Freelancers can update their profile
--Clients can post gigs
--Freelancers can browse gigs and apply
--Admin can manage users and gigs

Future Enhancements
--Payment gateway integration
--Ratings & reviews for freelancers
--Email notifications
--Advanced search and filters for gigs

This README gives a full guide for developers to set up the project, run the frontend/backend, and connect to MongoDB.
