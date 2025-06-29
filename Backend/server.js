// ✅ Load environment variables before anything else
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });

// ✅ Debug environment (optional)
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js"; // in case you have user routes

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS: allow frontend to talk to API
app.use(
  cors({
    origin: "http://localhost:5500", // your frontend origin (adjust if needed)
    credentials: true,
  })
);

// ✅ Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "influSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: "lax",
    },
  })
);

// ✅ Serve static frontend files (important!)
app.use(express.static(path.resolve("./public"))); 
// You can place your HTML and JS in a /public folder, or adjust the path accordingly.

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter); // if you have user routes

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ API Working - Backend is live");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
