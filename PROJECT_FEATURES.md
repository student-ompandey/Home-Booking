# Settel Inn - Project Overview & Features

Settel Inn is a production-grade, full-stack luxury room booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It is designed with a premium, cinematic user interface and includes real-time communication capabilities.

## 🌟 Core Features

### 1. Authentication & Authorization
* **Role-Based Access Control:** Secure authentication supporting multiple user roles (`User`, `Owner/Host`, and `Admin`).
* **JWT Security:** JSON Web Token (JWT) based authentication for secure session management.
* **Dedicated Auth Pages:** Custom `Login` and `Signup` flows.

### 2. Property & Room Management
* **Host Dashboard:** Owners can list and manage their properties via the `MyListings` page.
* **Room Creation:** Comprehensive `AddRoom` interface for hosts to provide property details, amenities, and location.
* **Media Uploads:** Seamless image uploading and storage integration using Cloudinary and Multer.

### 3. Search & Discovery
* **Interactive Map:** Integrated map view using Leaflet to explore properties geographically.
* **Advanced Filtering:** Capabilities to sort and filter rooms based on user preferences.
* **Wishlist:** Users can save and favorite rooms to their personal wishlist for later booking.
* **Premium UI:** Cinematic dark mode sections, glassmorphism, and smooth animations powered by Tailwind CSS v4.

### 4. Booking & Reviews
* **Detailed Listings:** Rich `RoomDetail` page showcasing images, host information, and amenities.
* **Booking System:** End-to-end booking flow allowing users to reserve stays.
* **Review System:** Guests can leave ratings and reviews for properties they have visited, establishing trust and safety.

### 5. Real-Time Communication
* **Live Chat:** Real-time messaging between guests and hosts powered by Socket.IO (`ChatPage`).
* **Instant Notifications:** Live alerts for booking updates and new messages.

## 🛠️ Technology Stack

### Frontend
* **Core:** React 19, Vite
* **Styling:** Tailwind CSS v4
* **Routing:** React Router v7
* **Mapping:** Leaflet & React-Leaflet
* **State/Data:** Axios (API calls)
* **Icons:** Lucide React

### Backend
* **Core:** Node.js, Express 5
* **Database:** MongoDB & Mongoose
* **Real-time:** Socket.IO
* **File Storage:** Cloudinary
* **Security & Validation:** Helmet, Express Rate Limit, bcryptjs, Joi, JSONWebToken
