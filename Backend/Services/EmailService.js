const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter with Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'kpherbals300@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: false, // Disable debug now that it's working
      logger: false
    });
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP email
  async sendOTP(email, otp, userName = 'User') {
    try {
      const mailOptions = {
        from: {
          name: 'Leeya Herbals',
          address: process.env.EMAIL_USER || 'kpherbals300@gmail.com'
        },
        to: email,
        subject: 'Your Login OTP - Leeya Herbals',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1dbf73; margin: 0; font-size: 28px;">LEEYA HERBALS</h1>
                <p style="color: #666; margin: 5px 0;">Natural Skincare Products</p>
              </div>
              
              <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Login Verification</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Hello ${userName},
              </p>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                We received a login request for your Leeya Herbals account. Please use the following OTP to complete your login:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #1dbf73; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                <strong>Important:</strong>
              </p>
              <ul style="color: #555; font-size: 14px; line-height: 1.6;">
                <li>This OTP is valid for <strong>10 minutes</strong> only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this login, please ignore this email</li>
              </ul>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  This is an automated email from Leeya Herbals. Please do not reply to this email.
                </p>
                <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
                  For support, contact us at kpherbals300@gmail.com
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email (optional)
  async sendWelcomeEmail(email, userName) {
    try {
      const mailOptions = {
        from: {
          name: 'Leeya Herbals',
          address: process.env.EMAIL_USER || 'kpherbals300@gmail.com'
        },
        to: email,
        subject: 'Welcome to Leeya Herbals - Natural Skincare Products',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1dbf73; margin: 0; font-size: 28px;">LEEYA HERBALS</h1>
                <p style="color: #666; margin: 5px 0;">Natural Skincare Products</p>
              </div>
              
              <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to Our Family!</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Dear ${userName},
              </p>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Thank you for joining Leeya Herbals! We're excited to have you as part of our community dedicated to natural skincare.
              </p>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Explore our range of natural products and enjoy your journey to healthier skin!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #1dbf73; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Start Shopping
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  For support, contact us at kpherbals300@gmail.com | +91 9254473593
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
