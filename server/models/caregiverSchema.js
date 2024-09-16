const mongoose = require("mongoose");
const { Schema } = mongoose;

const caregiverSchema = new Schema({
  patient: [{ type: Schema.Types.ObjectId, ref: "User" }],
  specialization: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  hospitalAffiliations: [{ type: String, required: true }],
  consultationHours: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      yearOfCompletion: { type: Number },
    },
  ],
  certifications: [
    {
      certificationName: { type: String },
      certifyingBody: { type: String },
      yearOfCertification: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update the updatedAt field
caregiverSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Caregiver = mongoose.model("Caregiver", caregiverSchema);
module.exports = Caregiver;
