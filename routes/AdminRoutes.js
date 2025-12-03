const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");

const Contact = require("../models/Contact");
const Enrollment = require("../models/Enrollment");

/* ============================================
   1. ADMIN LOGIN (punya kamu sebelumnya)
   ============================================ */
router.post("/login", loginAdmin);

/* ============================================
   2. ADMIN DASHBOARD – Statistik untuk StatCard
   ============================================ */
router.get("/stats", async (req, res) => {
  try {
    const inquiries = await Contact.countDocuments();

    const enrollments = await Enrollment.find();

    const enrollmentsToday = enrollments.filter((e) => {
      const created = new Date(e.createdAt);
      const today = new Date();
      return (
        created.getDate() === today.getDate() &&
        created.getMonth() === today.getMonth() &&
        created.getFullYear() === today.getFullYear()
      );
    }).length;

    const pendingPayments = enrollments.filter(
      (e) => e.paymentStatus === "pending"
    ).length;

    res.json({
      inquiries,
      enrollmentsToday,
      pendingPayments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   3. RECENT ACTIVITY TABLE
   ============================================ */
router.get("/recent-activity", async (req, res) => {
  try {
    const recentEnroll = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      enrollments: recentEnroll,
      contacts: recentContacts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   4. LINE CHART – submissions per bulan
   ============================================ */
router.get("/submissions-chart", async (req, res) => {
  try {
    const data = await Enrollment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   5. DONUT CHART – jumlah enrollment per course
   ============================================ */
router.get("/enrollment-donut", async (req, res) => {
  try {
    const grouped = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
