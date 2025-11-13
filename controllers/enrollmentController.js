const Enrollment = require("../models/Enrollment");

exports.createEnrollment = async (req, res, next) => {
  try {
    const enroll = new Enrollment(req.body);
    await enroll.save();
    res.status(201).json({ message: "Enrollment created", data: enroll });
  } catch (err) {
    next(err);
  }
};

exports.getEnrollments = async (req, res, next) => {
  try {
    const enrolls = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrolls);
  } catch (err) {
    next(err);
  }
};

exports.getEnrollmentById = async (req, res, next) => {
  try {
    const enroll = await Enrollment.findById(req.params.id);
    if (!enroll) return res.status(404).json({ message: "Not found" });
    res.json(enroll);
  } catch (err) {
    next(err);
  }
};

exports.updateEnrollment = async (req, res, next) => {
  try {
    const enroll = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Enrollment updated", data: enroll });
  } catch (err) {
    next(err);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: "Enrollment deleted" });
  } catch (err) {
    next(err);
  }
};
