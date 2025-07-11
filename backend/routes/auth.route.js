import express from "express";
import {
  getMe,
  login,
  logout,
  signup,
  verifyOtp,
  resendOtp,
  sendOtp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp", sendOtp); 
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
