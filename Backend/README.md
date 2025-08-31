# Leeya Herbals Backend

This is the backend API for the Leeya Herbals skincare website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=8080
MONGO_CONN="mongodb://127.0.0.1:27017/auth-db"
JWT_SECRET="secret123"
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Products
- `GET /products` - Get products (requires authentication)

## Features
- User authentication with JWT
- Password hashing with bcrypt
- Input validation with Joi
- MongoDB integration with Mongoose
- CORS enabled for frontend integration
