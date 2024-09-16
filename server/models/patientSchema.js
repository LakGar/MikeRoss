const mongoose = require("mongoose");
const { Schema } = mongoose;

const patientSchema = new Schema({
  medicalInformation: {
    age: {
      type: Number,
      required: true,
    },
    dementiaStage: {
      type: String,
      required: true,
    },
    height: {
      feet: { type: Number },
      inches: { type: Number },
    },
    weight: { type: Number },
    bloodType: { type: String },
    allergies: [{ type: String }],
    medications: [{ type: String }],
    surgeries: [{ type: String }],
  },
  test: [
    {
      testName: { type: String, required: true },
      testResult: { type: String, required: true },
      testDate: { type: Date, required: true },
    },
  ],
  doctor: [{ type: Schema.Types.ObjectId, ref: "User" }],
  caregiver: [{ type: Schema.Types.ObjectId, ref: "User" }],
  family: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sleep: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      quality: { type: Number, min: 1, max: 5, required: true },
      notes: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  mood: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      moodType: {
        type: String,
        enum: ["happy", "sad", "angry", "anxious", "disgusted"],
        required: true,
      },
      notes: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  activity: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      activityType: { type: String, required: true },
      duration: { type: Number, required: true },
      notes: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  emergencyContacts: [
    {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
  ],
  chronicConditions: [{ type: String }],
  immunizations: [
    {
      vaccineName: { type: String },
      dateAdministered: { type: Date },
      provider: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update the updatedAt field
patientSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
