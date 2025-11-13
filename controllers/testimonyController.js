const Testimony = require("../models/Testimony");

exports.createTestimony = async (req, res) => {
  try {
    const testimony = new Testimony(req.body);
    await testimony.save();
    res.status(201).json({ message: "✅ Testimony added successfully!", data: testimony });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTestimonies = async (req, res) => {
  try {
    const testimonies = await Testimony.find().sort({ createdAt: -1 });
    res.json(testimonies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
