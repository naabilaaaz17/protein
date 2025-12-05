const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const enrollmentSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, 
    child: { type: String, required: true },
    gender: { type: String, required: true },
    birthDate: { type: String, required: true },
    religion: { type: String, required: true },
    address: { type: String, required: true },
    school: { type: String, required: true },
    parent: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    program: { type: String, required: true },
    grade: { type: String, required: true },
    number: { type: String, required: true },
    status: { type: String, default: "Pending" },
    documents: [documentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);