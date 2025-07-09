// utils/sendWelcomeMail.js
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

const sendWelcomeMail = async (to, name) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">
      <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden;">
        <div style="background: linear-gradient(to right, #4f46e5, #9333ea); padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px;">Welcome to Snapzy 🎉</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hi <strong>${name || "there"}</strong>,</p>
          <p style="margin: 16px 0; font-size: 15px;">
            We're thrilled to have you join <strong>Snapzy</strong> — your social space to connect, share, play, and explore with AI!
          </p>
          <p style="font-size: 15px; margin-bottom: 24px;">
            Here’s what you can do on Snapzy:
            <ul style="margin-left: 20px; font-size: 14px;">
              <li>📝 Post & comment freely</li>
              <li>💬 Chat with community</li>
              <li>🤖 Ask Gemini AI anything</li>
              <li>🎮 Play mini games</li>
              <li>🔒 Enjoy safe & secure space</li>
            </ul>
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            We're glad you're here! If you ever need support, just reach out to us.
          </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          &copy; ${new Date().getFullYear()} Snapzy · All rights reserved.
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Snapzy" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to Snapzy!",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error.message);
  }
};

export default sendWelcomeMail;
