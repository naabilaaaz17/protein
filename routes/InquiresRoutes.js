const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const Enrollment = require("../models/Enrollment");

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    const enrollments = await Enrollment.find();

    const formattedContacts = contacts.map((c) => ({
      date: c.createdAt,
      name: c.name,
      email: c.email,
      whatsapp: c.phone,
      subject: c.subject ?? "Contact Form",
      status: c.status ?? "New",
    }));

    const formattedEnrollments = enrollments.map((e) => ({
      date: e.createdAt,
      name: e.parentName,
      email: e.parentEmail,
      whatsapp: e.parentPhone,
      subject: "Enrollment",
      status: e.status ?? "New",
    }));

    const merged = [...formattedContacts, ...formattedEnrollments].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
