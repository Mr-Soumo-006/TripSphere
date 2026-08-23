# 🌍 TripSphere - Luxury Travel Portal

TripSphere is a premium, full-stack travel booking and itinerary management platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a sleek, high-end dark mode aesthetic tailored for luxury travel experiences.

## ✨ Key Features

- **Luxury Dark Theme:** A visually stunning UI featuring zinc backgrounds and gold accents (#d4af37), designed to evoke exclusivity.
- **Dynamic Tour Itinerary & Mapping:** Admins can build step-by-step itineraries utilizing real-world autocomplete data from OpenStreetMap. Users can view their planned stops dynamically rendered on an interactive eact-leaflet map.
- **Advanced Search & Filtering:** Filter the entire tour catalog dynamically by Max Price (up to ₹5,00,000), Max Duration, Minimum Star Rating, and thematic Categories (e.g., Adventure, Honeymoon, Luxury).
- **Wishlist & Favorites:** Logged-in users can heart (❤️) their favorite tours and access them later from their personalized dashboard.
- **Simulated Checkout System:** Realistic payment and checkout flows (without real payment gateways) for seamless testing and demonstration.
- **User Profiles & Avatars:** Fully functional user dashboard allowing localized image file uploads for profile avatars and bio editing.
- **Automated Booking Emails:** Immediate HTML email receipts are dispatched upon successful tour bookings (configured with Nodemailer & Ethereal for dev environments).
- **Reviews & Ratings:** Authenticated users can leave reviews and star ratings on tours, which dynamically updates the tour's overall score in real-time.
- **Admin Dashboard:** Comprehensive admin controls to add, edit, and delete tours, manage users, and curate categories.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router DOM, Axios, React-Leaflet
- **Backend:** Node.js, Express.js, Mongoose, Nodemailer, Multer
- **Database:** MongoDB
- **Styling:** Custom CSS, Inline styling (Luxury Dark Theme)

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- Node.js installed
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repository

`ash
git clone https://github.com/Mr-Soumo-006/TripSphere.git
cd TripSphere
`

### 2. Setup the Backend

`ash
cd backend
npm install
`

Create a .env file in the ackend directory and add the following variables:

`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travel-portal
JWT_SECRET=your_jwt_secret_key_here
`

Start the backend server:
`ash
npm run dev
`

### 3. Setup the Frontend

Open a new terminal window:
`ash
cd frontend
npm install
`

Start the Vite development server:
`ash
npm run dev
`

Visit http://localhost:5173 in your browser to view the application.

## 📝 License

This project is licensed under the MIT License.
