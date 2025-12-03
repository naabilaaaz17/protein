const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder uploads/gallery ada
const uploadDir = "uploads/gallery";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// GET all gallery images
router.get("/", async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new gallery image (with file upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/gallery/${req.file.filename}`;
    const ext = req.file.originalname.split(".").pop().toLowerCase();
    
    const galleryItem = new Gallery({
      fileUrl,
      fileType: ext,
      fileName: req.file.originalname,
      uploadedBy: req.body.uploadedBy || "Admin"
    });

    await galleryItem.save();
    res.status(201).json({
      message: "✅ Image added successfully!",
      data: galleryItem
    });
  } catch (err) {
    // Hapus file jika save gagal
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE gallery image
router.delete("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Hapus file dari server
    const filePath = gallery.imageUrl.replace("/uploads/gallery/", uploadDir + "/");
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.json({ message: "✅ Image deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;