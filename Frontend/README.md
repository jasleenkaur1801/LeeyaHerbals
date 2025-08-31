# Leeya Herbals Frontend

This is the frontend for the Leeya Herbals skincare website with integrated authentication system.

## Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication System**: Login and signup functionality with JWT tokens
- **User Profile**: Dropdown menu with user information and actions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Product Management**: Browse, search, and manage products
- **Shopping Cart**: Add/remove items and manage quantities
- **Wishlist**: Save favorite products for later

## Authentication Components

### AuthModal
- Beautiful modal for login and signup
- Form validation and error handling
- Smooth transitions and animations
- Social login options (Google, Facebook)

### UserProfile
- User avatar with initials
- Dropdown menu with user actions
- Profile, orders, wishlist, and settings
- Logout functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make sure the backend server is running on port 8080

## Authentication Flow

1. **Login**: User enters email and password
2. **Signup**: User provides name, email, and password
3. **JWT Token**: Backend returns JWT token on successful authentication
4. **Local Storage**: Token and user data stored in browser
5. **User Profile**: Navbar shows user profile instead of login button
6. **Logout**: Clears local storage and returns to login state

## API Integration

The frontend communicates with the backend API endpoints:
- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /products` - Fetch products (requires authentication)

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Styled authentication modals and user profile
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## File Structure

```
src/
├── App.jsx              # Main application component
├── AuthModal.jsx        # Authentication modal component
├── AuthModal.css        # Authentication modal styles
├── UserProfile.jsx      # User profile dropdown component
├── UserProfile.css      # User profile styles
├── ProductPage.jsx      # Individual product page
├── SearchResultsPage.jsx # Search results page
└── App.css             # Main application styles
```

## State Management

The app uses React hooks for state management:
- `user`: Current authenticated user data
- `isAuthenticated`: Authentication status
- `showAuth`: Controls authentication modal visibility
- `cart`: Shopping cart items
- `wishlist`: Saved favorite products

## Browser Storage

- **JWT Token**: Stored in localStorage for authentication
- **User Data**: User information cached in localStorage
- **Cart & Wishlist**: Shopping data persisted in localStorage
