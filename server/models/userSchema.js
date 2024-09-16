const mongoose = require("mongoose");
const { Schema } = mongoose;

// File sub-schema for uploaded files
const fileSchema = new Schema({
  name: { type: String, required: true }, // File name
  size: { type: Number, required: true }, // File size in bytes
  tags: [String], // Tags related to the file
  starred: { type: Boolean, default: false }, // File starred status
  createdAt: { type: Date, default: Date.now }, // Date when the file was uploaded
  filePath: { type: String, required: true }, // Add this line to store the file path
  analysis: { type: String },
  conversation: [
    {
      question: String,
      response: String,
    },
  ],
  riskAnalysis: { type: String },
});

// Main User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  address: {
    address1: String,
    address2: String,
    state: String,
    country: String,
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ["public", "private", "custom"],
    },
    dataSharingPermissions: [{ type: String }],
  },
  profilePicture: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg",
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  files: [fileSchema], // Array of files uploaded by the user
});

// Pre-save middleware to update the updatedAt field
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
