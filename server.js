require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect MongoDB
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Import Routes
const contactRoutes = require("./routes/ContactRoutes");
const enrollmentRoutes = require("./routes/EnrollmentRoutes");
const galleryRoutes = require("./routes/GalleryRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const testimonyRoutes = require("./routes/TestimonyRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Register Routes - PASTIKAN INI ADA
app.use("/api/contacts", contactRoutes);
app.use("/api/enrollment", enrollmentRoutes);  // ⭐ INI YANG PENTING
app.use("/api/gallery", galleryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/testimony", testimonyRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend is running!", 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ 404 Not Found:", req.method, req.url);
  res.status(404).json({ 
    error: "Route not found", 
    method: req.method,
    path: req.url 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n⚡ Server running on http://localhost:${PORT}`);
  console.log("\n📋 Available endpoints:");
  console.log(`   GET    http://localhost:${PORT}/api/enrollment`);
  console.log(`   POST   http://localhost:${PORT}/api/enrollment`);
  console.log(`   GET    http://localhost:${PORT}/api/enrollment/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/enrollment/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/enrollment/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/test\n`);
});