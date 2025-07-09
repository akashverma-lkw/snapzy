import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/nodemailer.js";
import sendWelcomeMail from '../config/sendWelcomeMail.js'

// generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Resend OTP Controller
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not registered" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    // Generate and update new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    // Send OTP email
    await sendMail(email, "Snapzy - New OTP Request", `Your new OTP is: ${otp}`);

    res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.log("Error in resendOtp controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Signup Controller (with OTP)
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Username or email is already taken" });
      }

      // ⚠️ User exists but is not verified → resend OTP
      const otp = generateOTP();
      existingUser.otp = otp;
      existingUser.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

      await existingUser.save();
      await sendMail(email, "Snapzy Email Verification (Resent)", `Your OTP is: ${otp}`);

      return res.status(200).json({
        message: "OTP resent to your email. Please verify to complete registration.",
        userId: existingUser._id,
      });
    }

    // Create new user
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();
    await sendMail(email, "Snapzy Email Verification", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "OTP sent to email. Please verify to complete registration.",
      userId: newUser._id,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// OTP Controller
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
    await sendWelcomeMail(user.email, user.fullName);

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.log("Error in verifyOtp controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login Controller (only if verified)
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

// Logout (Client-side)
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Logged-in User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
