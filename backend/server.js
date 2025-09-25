const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ debug: true });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to database
connectDB();

// CORS configuration - allow both localhost:3000 and localhost:5173
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend is running...",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      getProfile: "GET /api/auth/me"
    }
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));