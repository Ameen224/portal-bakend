# Client Portal Backend API

A Node.js Express backend with MongoDB following MVC architecture for managing clients and products.

## Features

- JWT Authentication for Super Admin
- Dashboard with statistics
- Client management (CRUD operations)
- Product management (CRUD operations)
- Protected routes with role-based access
- Consistent JSON API responses

## API Endpoints

### Authentication
- `POST /api/auth/login` - Super Admin login

### Dashboard (Protected)
- `GET /api/dashboard` - Get dashboard statistics

### Clients
- `GET /api/clients` - Get all clients (Public)
- `POST /api/clients` - Add new client (Protected)

### Products
- `GET /api/products` - Get all products (Public)
- `POST /api/products` - Add new product (Protected)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Update `.env` file with your MongoDB URI and JWT secret.

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Seed sample data:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Default Super Admin Credentials

- **Email:** admin@clientportal.com
- **Password:** admin123

## API Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── clientController.js
│   ├── productController.js
│   └── dashboardController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Client.js
│   └── Product.js
├── routes/
│   ├── authRoutes.js
│   ├── clientRoutes.js
│   ├── productRoutes.js
│   └── dashboardRoutes.js
├── server.js
├── seed.js
├── package.json
└── .env
```