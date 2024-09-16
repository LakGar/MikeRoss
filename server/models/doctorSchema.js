const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new Schema({
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
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      yearOfCompletion: { type: Number, required: true },
    },
  ],
  certifications: [
    {
      certificationName: { type: String, required: true },
      certifyingBody: { type: String, required: true },
      yearOfCertification: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update the updatedAt field
doctorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
