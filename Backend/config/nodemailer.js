import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.elasticemail.com
  port: parseInt(process.env.SMTP_PORT), // 587
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transport Error:", error.message);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

export default transporter;
