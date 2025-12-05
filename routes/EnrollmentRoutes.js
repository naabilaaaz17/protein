const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

console.log("✅ EnrollmentRoutes module loaded");

// GET all enrollments
router.get("/", enrollmentController.getEnrollments);

// GET single enrollment by ID
router.get("/:id", enrollmentController.getEnrollmentById);

// POST new enrollment
router.post("/", enrollmentController.createEnrollment);

// PUT update enrollment
router.put("/:id", enrollmentController.updateEnrollment);

// DELETE enrollment
router.delete("/:id", enrollmentController.deleteEnrollment);

module.exports = router;