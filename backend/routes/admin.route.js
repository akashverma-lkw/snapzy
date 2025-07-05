import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  deleteUser,
  getAllPosts,
  verifyAdminPassword,
  updateAdminSettings
} from "../controllers/admin.controller.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin Dashboard Data Routes
router.get("/users", getAllUsers);
router.get("/posts", getAllPosts);
router.delete("/users/delete/:id", deleteUser);

// ✅ Admin Settings Routes
router.post("/verify-password", verifyAdminPassword); // Verifies old password
router.put("/update-settings", updateAdminSettings);  // Updates email or password

export default router;
