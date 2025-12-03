const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    childName: { type: String, required: true },
    gender: { type: String, required: true },
    birthDate: { type: String, required: true },
    religion: { type: String, required: true },
    address: { type: String, required: true },

    parentName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },

    familyCard: { type: String }, // path file upload
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);