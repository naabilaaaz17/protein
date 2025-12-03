const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Enrollment = require("../models/Enrollment");

// === MULTER STORAGE ===
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
/**
 * @swagger
 * tags:
 *   - name: Enrollments
 *     description: API untuk pendaftaran siswa baru
 */

/**
 * @swagger
 * /api/enroll:
 *   post:
 *     summary: Buat pendaftaran siswa baru
 *     tags: [Enrollments]
 *     description: Mengirim data siswa, data orang tua, dan upload file Kartu Keluarga (KK).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - childName
 *               - gender
 *               - birthDate
 *               - religion
 *               - address
 *               - parentName
 *               - email
 *               - whatsapp
 *             properties:
 *               childName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Laki-laki, Perempuan]
 *               birthDate:
 *                 type: string
 *                 format: date
 *               religion:
 *                 type: string
 *               address:
 *                 type: string
 *               parentName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               whatsapp:
 *                 type: string
 *               familyCard:
 *                 type: string
 *                 format: binary
 *                 description: Upload scan/foto Kartu Keluarga
 *     responses:
 *       200:
 *         description: Pendaftaran berhasil dibuat.
 *       500:
 *         description: Gagal membuat pendaftaran.
 */


router.post("/", upload.single("familyCard"), async (req, res) => {
  try {
    const enrollment = new Enrollment({
      childName: req.body.childName,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      religion: req.body.religion,
      address: req.body.address,

      parentName: req.body.parentName,
      email: req.body.email,
      whatsapp: req.body.whatsapp,

      familyCard: req.file ? req.file.path : null, 
    });

    await enrollment.save();

    res.status(201).json({
      message: "Enrollment created successfully",
      data: enrollment,
    });
  } catch (error) {
    // 🛑 Log detail error untuk diagnosis
    console.error("DETAIL ENROLLMENT ERROR:", error); 

    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ 
            error: "Validation failed: " + messages.join(', ')
        });
    }

    res.status(500).json({ error: "Failed to create enrollment" });
  }
});

module.exports = router;