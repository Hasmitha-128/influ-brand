import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail SMTP Error:", error.message);
  } else {
    console.log("✅ Gmail SMTP is ready to send emails");
  }
});

export default transporter;
