import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a professional OTP email
 * @param {string} to - Recipient's email
 * @param {string} otp - The 6-digit OTP
 */
const sendMail = async (to, subject, otp) => {
  try {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #4f46e5, #9333ea); padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px;">Snapzy Email Verification</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi there,</p>
            <p style="font-size: 15px; margin-bottom: 20px;">
              Thank you for signing up with <strong>Snapzy</strong>. To complete your registration, please enter the following OTP code in the app:
            </p>
            <div style="font-size: 28px; font-weight: bold; text-align: center; color: #4f46e5; margin: 30px 0;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} Snapzy · All rights reserved.
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Snapzy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent to: ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendMail;
