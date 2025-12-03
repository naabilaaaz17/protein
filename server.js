require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Debug mongo
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Import Routes
const contactRoutes = require("./routes/ContactRoutes");
const enrollmentRoutes = require("./routes/EnrollmentRoutes");
const galleryRoutes = require("./routes/GalleryRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const testimonyRoutes = require("./routes/TestimonyRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// Register API Routes (plural & clean)
app.use("/api/contacts", contactRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/testimony", testimonyRoutes);
app.use("/api/admin", adminRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
