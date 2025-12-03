const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },  // Bisa image atau pdf
  fileType: { type: String, enum: ["jpg", "jpeg", "png", "gif", "webp", "pdf"], required: true },
  fileName: { type: String, required: true },
  uploadedBy: { type: String, default: "Admin" }, 
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);