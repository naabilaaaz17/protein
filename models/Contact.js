const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  reply: { type: String, default: "" },
  replyDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
