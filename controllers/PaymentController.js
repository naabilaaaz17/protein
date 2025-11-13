const Payment = require("../models/PaymentModel");

const createPayment = async (req, res) => {
  try {
    const { studentName, parentName, amount, paymentProofUrl, whatsappNumber } = req.body;

    if (!studentName || !parentName || !amount || !paymentProofUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPayment = new Payment({
      studentName,
      parentName,
      amount,
      paymentProofUrl,
      whatsappNumber,
      date: new Date(),
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment submitted successfully",
      data: newPayment,
    });
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createPayment };
