# 🏠 Settel Inn — Room Booking Platform Backend

A scalable RESTful API backend for a room booking platform built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

## 📁 Project Structure

```
Home-Booking/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js    # Register & Login logic
│   └── roomController.js    # Room CRUD logic
├── middleware/
│   ├── auth.js              # JWT protect & role authorize
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User schema (name, email, password, role)
│   └── Room.js              # Room schema (title, price, location, etc.)
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── roomRoutes.js        # Room endpoints
├── .env                     # Environment variables (not committed)
├── .gitignore
├── package.json
├── server.js                # App entry point
└── README.md
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Edit the `.env` file with your MongoDB connection string and JWT secret:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/settelinn
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Run the server
```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description       |
|--------|----------------------|---------|-------------------|
| POST   | `/api/auth/register` | Public  | Register new user |
| POST   | `/api/auth/login`    | Public  | Login user        |

### Rooms
| Method | Endpoint          | Access    | Description              |
|--------|------------------|-----------|--------------------------|
| GET    | `/api/rooms`     | Public    | Get all rooms (filterable) |
| GET    | `/api/rooms/:id` | Public    | Get single room          |
| POST   | `/api/rooms`     | Protected | Create a room            |
| PUT    | `/api/rooms/:id` | Protected | Update a room (owner only) |
| DELETE | `/api/rooms/:id` | Protected | Delete a room (owner only) |

### Query Parameters (GET /api/rooms)
| Param      | Type   | Description                |
|-----------|--------|----------------------------|
| location  | string | Filter by location (regex) |
| roomType  | string | Filter by room type        |
| minPrice  | number | Minimum price filter       |
| maxPrice  | number | Maximum price filter       |
| page      | number | Page number (default: 1)   |
| limit     | number | Items per page (default: 10) |

## 🔐 Authentication

Protected routes require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Dev Tools**: Nodemon, dotenv
