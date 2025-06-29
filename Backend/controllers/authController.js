import User from "../models/userModel.js";
import nodemailer from "nodemailer";

let otpStore = {}; // Temporary OTP storage

// ✅ Get nodemailer transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ====================== REGISTER ======================
export const register = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = new User({
      email,
      name,
      password,
    });

    await newUser.save();
    req.session.userId = newUser._id;

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    req.session.userId = user._id;

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ====================== LOGOUT ======================
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
};

// ====================== SESSION CHECK ======================
export const isAuthenticated = (req, res) => {
  if (req.session.userId) {
    res.json({ success: true, userId: req.session.userId });
  } else {
    res.status(401).json({ success: false, message: "User not authenticated" });
  }
};

// ====================== SEND EMAIL VERIFY OTP ======================
export const sendVerifyOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, purpose: "verify" };

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || process.env.MAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Send Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// ====================== VERIFY EMAIL OTP ======================
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (record && record.otp === otp && record.purpose === "verify") {
    await User.updateOne({ email }, { isAccountVerified: true });
    delete otpStore[email];
    res.json({ success: true, message: "Email verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};

// ====================== SEND PASSWORD RESET OTP ======================
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Send Reset OTP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ====================== RESET PASSWORD ======================
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.resetOtp === otp && user.resetOtpExpireAt > Date.now()) {
      user.password = newPassword;
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      await user.save();
      res.json({ success: true, message: "Password reset successful" });
    } else {
      res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("Reset Password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
