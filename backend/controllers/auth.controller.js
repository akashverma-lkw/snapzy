import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/nodemailer.js";
import sendWelcomeMail from '../config/sendWelcomeMail.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Please verify your email first." });

    if (user.isVerified === false) {
      return res.status(403).json({ error: "Email not verified yet." });
    }

    if (user.username || user.fullName || user.password) {
      return res.status(400).json({ error: "User already signed up" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.fullName = fullName;
    user.username = username;
    user.password = hashedPassword;

    await user.save();
    await sendWelcomeMail(user.email, user.fullName);

    res.status(201).json({
      message: "Account created successfully. You can now log in.",
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Send OTP on email input
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ error: "Email already registered and verified" });
    }

    if (!user) {
      user = new User({
        email,
        isVerified: false,
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendMail(email, "Snapzy Email OTP", `Your OTP is: ${otp}`);

    res.status(200).json({
      message: "OTP sent to email. Please verify to continue.",
    });
  } catch (error) {
    console.error("Error in sendOtp controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// OTP Verification
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now complete registration." });
  } catch (error) {
    console.log("Error in verifyOtp controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not registered" });

    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendMail(email, "Snapzy - New OTP Request", `Your new OTP is: ${otp}`);

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.log("Error in resendOtp controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Signup (after email is verified)


// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout (Handled client-side)
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Logged-in User Info
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
