import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// ✅ Registration
router.post("/register", register);

// ✅ Login
router.post("/login", login);

// ✅ Logout
router.post("/logout", logout);

// ✅ Check if user is authenticated
router.get("/is-authenticated", isAuthenticated);

// ✅ Email verification
router.post("/send-verify-otp", sendVerifyOtp);
router.post("/verify-email", verifyEmail);

// ✅ Password reset
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

export default router;
