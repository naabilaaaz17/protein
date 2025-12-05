const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  courseId: String,
  courseName: String,
  amount: Number,
  billing: String,
  proofUrl: String
});

module.exports = mongoose.model("Payment", PaymentSchema);
