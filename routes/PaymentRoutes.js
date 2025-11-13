const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

// ✅ Pastikan folder uploads ada
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Folder 'uploads' otomatis dibuat di:", uploadDir);
}

// ✅ Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Endpoint: POST /api/payment
router.post("/", upload.single("receipt"), async (req, res) => {
  try {
    const { name, amount, method } = req.body;

    if (!name || !amount || !method || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Semua kolom wajib diisi dan bukti pembayaran harus diunggah.",
      });
    }

    const paymentData = {
      name,
      amount,
      method,
      receipt: `/uploads/${req.file.filename}`,
      createdAt: new Date(),
    };

    console.log("💰 Pembayaran diterima:", paymentData);

    // ✅ Kirim pesan ke WhatsApp admin via Fonnte API
    const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
    const ADMIN_WA = process.env.ADMIN_WA;

    if (FONNTE_TOKEN && ADMIN_WA) {
      const message = `📢 *KONFIRMASI PEMBAYARAN BARU*\n\n👤 Nama: ${name}\n💰 Jumlah: Rp${amount}\n💳 Metode: ${method}\n🧾 Bukti: http://localhost:5000${paymentData.receipt}\n\nMohon konfirmasi pembayaran ini.`;

      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": FONNTE_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: ADMIN_WA,
          message,
        }),
      });

      const result = await response.json();
      console.log("📨 WhatsApp sent result:", result);
    } else {
      console.log("⚠️ Token Fonnte atau nomor admin tidak ditemukan di .env");
    }

    res.json({
      success: true,
      message: "✅ Pembayaran berhasil dikirim dan notifikasi dikirim ke WhatsApp admin!",
      data: paymentData,
    });
  } catch (error) {
    console.error("❌ Error upload payment:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
});

module.exports = router;
