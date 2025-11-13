const Gallery = require("../models/Gallery");

exports.createGallery = async (req, res) => {
  try {
    const galleryItem = new Gallery(req.body);
    await galleryItem.save();
    res.status(201).json({ message: "✅ Image added successfully!", data: galleryItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
