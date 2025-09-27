# 🔧 Troubleshooting Guide

## Current Issues & Solutions

### Issue 1: Products API Error (500 Internal Server Error)

**Problem**: `Failed to load resource: the server responded with a status of 500 (Internal Server Error)` for `/products` endpoint.

**Quick Fix Applied**: 
- Added fallback to static products data when API fails
- App will now use `ALL_PRODUCTS` from `products.js` if the API is unavailable

**Permanent Solutions**:
1. **Check Database Connection**: Ensure MongoDB is running and connected
2. **Check Product Model**: Verify the Product model matches your database schema
3. **Add Products to Database**: If using API, ensure products exist in the database

### Issue 2: Reviews API 404 Error

**Problem**: `Failed to load resource: the server responded with a status of 404 (Not Found)` for `/api/products/2/reviews`

**Fix Applied**: 
- Fixed route middleware order in `ProductReviewRouter.js`
- Added graceful error handling in `ReviewList.jsx`
- Reviews section now shows "No reviews yet" instead of errors

**Root Cause**: The authentication middleware was applied to all routes, including public GET routes.

## Testing the Review System

### Option 1: Use Test Server (Recommended for Quick Testing)

1. **Start Test Server**:
   ```bash
   cd Backend
   node test-reviews.js
   ```
   This starts a test server on port 8081 with mock review data.

2. **Update Frontend for Testing**:
   Temporarily change the API URL in your components from `http://localhost:8080` to `http://localhost:8081`

### Option 2: Fix Main Server

1. **Ensure MongoDB is Running**:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

2. **Check Database Connection**:
   ```bash
   cd Backend
   node -e "require('./Models/db'); console.log('DB connected');"
   ```

3. **Start Main Server**:
   ```bash
   cd Backend
   npm start
   ```

## Current Status

✅ **Fixed Issues**:
- Route middleware order in ProductReviewRouter
- Graceful error handling in frontend components
- Fallback to static products when API fails

⚠️ **Remaining Issues**:
- Products API returning 500 error (likely database connection)
- Need to populate products in database or use static data

🔄 **Workarounds Active**:
- App falls back to static products automatically
- Review system shows empty state instead of errors
- All frontend components handle API failures gracefully

## Quick Test Steps

1. **Start Backend**: `cd Backend && npm start`
2. **Start Frontend**: `cd Frontend && npm start`
3. **Visit Product Page**: Go to any product (e.g., http://localhost:3000/product/1)
4. **Check Reviews Section**: Should show "No reviews yet" (not errors)
5. **Try Writing Review**: Click "Write a Review" button

## Expected Behavior

- **Products Load**: Either from API or fallback to static data
- **Reviews Section**: Shows empty state with "Write a Review" button
- **Review Form**: Opens when clicking "Write a Review"
- **Form Submission**: Shows appropriate message (success or error)

## Debug Commands

```bash
# Check if backend is running
curl http://localhost:8080/ping

# Test products endpoint
curl http://localhost:8080/products

# Test reviews endpoint
curl http://localhost:8080/api/products/1/reviews

# Check MongoDB connection
mongo --eval "db.adminCommand('ismaster')"
```

## Next Steps

1. **Fix Database Issues**: Ensure MongoDB is properly connected
2. **Populate Products**: Add products to database or continue using static data
3. **Test Review Submission**: Try submitting a review after login
4. **Monitor Console**: Check browser console for any remaining errors

The review system is now resilient to API failures and will provide a good user experience even when the backend has issues.
