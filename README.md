# 🏠 Settel Inn — Production-Grade Room Booking Backend

A scalable, secure RESTful API backend for a room booking platform built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

## ✨ Features

- **MVC + Service Layer** — Clean separation of concerns
- **JWT Authentication** — Access tokens (15m) + Refresh tokens (7d) with rotation
- **Role-Based Access Control** — `user`, `owner`, `admin` roles
- **Input Validation** — Joi schemas on all endpoints
- **Image Uploads** — Multer + Cloudinary (with local fallback)
- **Full-Text Search** — MongoDB weighted text search on rooms
- **Pagination & Filtering** — Location, price range, room type, availability
- **Security** — Helmet, CORS, bcrypt (12 rounds), HTTP-only cookies
- **Rate Limiting** — Tiered: API (100/15m), Auth (10/15m), Uploads (20/hr)
- **Logging** — Winston (console + file rotation in production)
- **Graceful Shutdown** — Clean MongoDB disconnect on SIGTERM/SIGINT
- **Error Handling** — Centralized handler with Mongoose/JWT/Multer support

---

## 📁 Project Structure

```
Home-Booking/
├── config/
│   ├── db.js                  # MongoDB connection (pooling, reconnect)
│   └── cloudinary.js          # Cloudinary image upload config
├── controllers/
│   ├── authController.js      # Register, login, refresh, logout
│   ├── roomController.js      # Room CRUD + image upload
│   └── userController.js      # Profile, password change
├── middleware/
│   ├── auth.js                # JWT protect + role authorize
│   ├── errorHandler.js        # Global error handler
│   ├── rateLimiter.js         # Rate limiting (API, auth, uploads)
│   ├── upload.js              # Multer config (memory storage)
│   └── validate.js            # Joi validation middleware factory
├── models/
│   ├── User.js                # User schema (roles, refresh tokens)
│   └── Room.js                # Room schema (text search, indexes)
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── roomRoutes.js          # Room endpoints
│   └── userRoutes.js          # User profile endpoints
├── services/
│   ├── authService.js         # Auth business logic
│   ├── roomService.js         # Room business logic
│   ├── uploadService.js       # Cloudinary/local upload logic
│   └── userService.js         # User profile business logic
├── utils/
│   ├── ApiError.js            # Custom error class with factory methods
│   ├── asyncHandler.js        # Async/await error wrapper
│   └── logger.js              # Winston logger setup
├── validators/
│   ├── authValidator.js       # Joi: register, login schemas
│   ├── roomValidator.js       # Joi: create, update, query schemas
│   └── userValidator.js       # Joi: profile, password schemas
├── .env                       # Environment variables (not committed)
├── .env.example               # Template for environment variables
├── .gitignore
├── package.json
├── server.js                  # App entry point
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Key variables:
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |

### 3. Run the server
```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint          | Access  | Description                |
|--------|-------------------|---------|----------------------------|
| POST   | `/register`       | Public  | Register new user          |
| POST   | `/login`          | Public  | Login user                 |
| POST   | `/refresh-token`  | Public  | Refresh access token       |
| POST   | `/logout`         | Private | Logout (current device)    |
| POST   | `/logout-all`     | Private | Logout (all devices)       |

### Rooms — `/api/rooms`
| Method | Endpoint    | Access           | Description                    |
|--------|-------------|------------------|--------------------------------|
| GET    | `/`         | Public           | List rooms (filter, search, paginate) |
| GET    | `/my-rooms` | Private          | Get own rooms (owner)          |
| GET    | `/:id`      | Public           | Get single room                |
| POST   | `/`         | Private (owner, admin) | Create room (+ image upload) |
| PUT    | `/:id`      | Private (owner, admin) | Update room                 |
| DELETE | `/:id`      | Private (owner, admin) | Delete room                 |

#### Query Parameters — `GET /api/rooms`
| Param       | Type    | Description                           |
|-------------|---------|---------------------------------------|
| `search`    | string  | Full-text search (title, location, description) |
| `location`  | string  | Filter by location (regex)            |
| `roomType`  | string  | single, double, suite, apartment, hostel, pg |
| `minPrice`  | number  | Minimum price                         |
| `maxPrice`  | number  | Maximum price                         |
| `isAvailable` | boolean | Filter by availability              |
| `sortBy`    | string  | price, createdAt, title               |
| `sortOrder` | string  | asc, desc                             |
| `page`      | number  | Page number (default: 1)              |
| `limit`     | number  | Items per page (default: 10, max: 50) |

### Users — `/api/users`
| Method | Endpoint           | Access        | Description         |
|--------|--------------------|---------------|---------------------|
| GET    | `/profile`         | Private       | Get own profile     |
| PUT    | `/profile`         | Private       | Update own profile  |
| PUT    | `/change-password` | Private       | Change password     |
| GET    | `/`                | Private (admin) | List all users    |

---

## 🔐 Authentication Flow

```
1. Register/Login → receive accessToken + refreshToken (HTTP-only cookie)
2. Use accessToken in Authorization header: "Bearer <token>"
3. When accessToken expires (15m) → POST /api/auth/refresh-token
4. Refresh token rotation: old token invalidated, new pair issued
5. Logout → invalidates refresh token for current device
6. Logout All → invalidates all refresh tokens (all devices)
```

---

## 🛠 Tech Stack

| Category     | Technology                          |
|-------------|-------------------------------------|
| Runtime     | Node.js ≥18                         |
| Framework   | Express.js 5                        |
| Database    | MongoDB + Mongoose                  |
| Auth        | JWT (access + refresh) + bcryptjs   |
| Validation  | Joi                                 |
| Uploads     | Multer + Cloudinary                 |
| Security    | Helmet, CORS, express-rate-limit    |
| Logging     | Winston + Morgan                    |
| Dev Tools   | Nodemon, dotenv                     |
