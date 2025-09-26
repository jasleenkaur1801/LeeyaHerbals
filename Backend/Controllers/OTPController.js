const User = require('../Models/User');
const OTP = require('../Models/OTP');
const EmailService = require('../Services/EmailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class OTPController {
  // Step 1: Verify credentials and send OTP
  static async sendLoginOTP(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Delete any existing OTPs for this email
      await OTP.deleteMany({ email: email.toLowerCase() });

      // Generate new OTP
      const otp = EmailService.generateOTP();

      // Save OTP to database
      const otpRecord = new OTP({
        email: email.toLowerCase(),
        otp: otp
      });
      await otpRecord.save();

      // Send OTP email
      const emailResult = await EmailService.sendOTP(email, otp, user.name);
      
      if (!emailResult.success) {
        console.log('Email sending failed, but continuing for development...', emailResult.error);
        // For development, continue even if email fails
        // In production, you should return an error here
      }

      res.json({
        success: true,
        message: emailResult.success ? 'OTP sent to your email address' : 'OTP generated (email service unavailable)',
        email: email.toLowerCase(),
        // Don't send OTP in production, only for development
        ...(process.env.NODE_ENV === 'development' && { otp })
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Step 2: Verify OTP and complete login
  static async verifyOTPAndLogin(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }

      // Find the most recent OTP for this email
      const otpRecord = await OTP.findOne({ 
        email: email.toLowerCase(),
        verified: false
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'OTP expired or not found. Please request a new one.'
        });
      }

      // Check if too many attempts
      if (otpRecord.attempts >= 3) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }

      // Verify OTP
      console.log('OTP Verification Debug:');
      console.log('Stored OTP:', otpRecord.otp, 'Type:', typeof otpRecord.otp);
      console.log('Received OTP:', otp, 'Type:', typeof otp);
      console.log('Match:', otpRecord.otp === otp);
      
      if (otpRecord.otp !== otp.toString()) {
        // Increment attempts
        otpRecord.attempts += 1;
        await otpRecord.save();

        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`
        });
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      // Get user details
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          _id: user._id, 
          email: user.email,
          role: user.role || 'customer'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Clean up - delete used OTP
      await OTP.deleteOne({ _id: otpRecord._id });

      console.log('OTP Verification successful, sending response...');
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'customer'
        }
      });

    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Resend OTP
  static async resendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Delete existing OTPs
      await OTP.deleteMany({ email: email.toLowerCase() });

      // Generate new OTP
      const otp = EmailService.generateOTP();

      // Save new OTP
      const otpRecord = new OTP({
        email: email.toLowerCase(),
        otp: otp
      });
      await otpRecord.save();

      // Send OTP email
      const emailResult = await EmailService.sendOTP(email, otp, user.name);
      
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP email. Please try again.'
        });
      }

      res.json({
        success: true,
        message: 'New OTP sent to your email address',
        // Don't send OTP in production
        ...(process.env.NODE_ENV === 'development' && { otp })
      });

    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = OTPController;
