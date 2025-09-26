const express = require('express');
const router = express.Router();
const OTPController = require('../Controllers/OTPController');

// Step 1: Send OTP after credential verification
router.post('/send-login-otp', OTPController.sendLoginOTP);

// Step 2: Verify OTP and complete login
router.post('/verify-login-otp', OTPController.verifyOTPAndLogin);

// Resend OTP
router.post('/resend-otp', OTPController.resendOTP);

module.exports = router;
