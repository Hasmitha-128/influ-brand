import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================== GET USER DATA ======================
export const getUserData = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userModel.findById(userId).select("-password -resetOtp -resetOtpExpireAt");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error("Get User Data error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ====================== RESET PASSWORD VIA JWT ======================
export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token or user" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
