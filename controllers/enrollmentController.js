const Enrollment = require("../models/Enrollment");

exports.createEnrollment = async (req, res) => {
  try {
    const enroll = new Enrollment(req.body);
    await enroll.save();
    res.status(201).json({ message: "Enrollment created", data: enroll });
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const enrolls = await Enrollment.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${enrolls.length} enrollments`);
    res.json(enrolls);
  } catch (err) {
    console.error("Error getting enrollments:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enroll = await Enrollment.findById(req.params.id);
    if (!enroll) return res.status(404).json({ message: "Not found" });
    res.json(enroll);
  } catch (err) {
    console.error("Error getting enrollment:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const enroll = await Enrollment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!enroll) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Enrollment updated", data: enroll });
  } catch (err) {
    console.error("Error updating enrollment:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const enroll = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enroll) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Enrollment deleted" });
  } catch (err) {
    console.error("Error deleting enrollment:", err);
    res.status(500).json({ error: err.message });
  }
};