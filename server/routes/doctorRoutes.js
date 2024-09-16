const express = require("express");
const Doctor = require("../models/doctorSchema");
const User = require("../models/userSchema");
const auth = require("../middlewares/auth");

const router = express.Router();

// Add a new doctor
router.post("/doctor", auth, async (req, res) => {
  const {
    userId,
    patient,
    specialization,
    yearsOfExperience,
    hospitalAffiliations,
    consultationHours,
    education,
    certifications,
  } = req.body;

  try {
    const doctor = new Doctor({
      patient,
      specialization,
      yearsOfExperience,
      hospitalAffiliations,
      consultationHours,
      education,
      certifications,
    });

    const savedDoctor = await doctor.save();

    const user = await User.findById(userId);
    user.doctorInfo = savedDoctor._id;
    await user.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all doctors
router.get("/doctors", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("patient", "-password");
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a doctor by ID
router.get("/doctor/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id).populate("patient", "-password");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a doctor by ID
router.put("/doctor/:id", auth, async (req, res) => {
  const { id } = req.params;
  const {
    patient,
    specialization,
    yearsOfExperience,
    hospitalAffiliations,
    consultationHours,
    education,
    certifications,
  } = req.body;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (patient) doctor.patient = patient;
    if (specialization) doctor.specialization = specialization;
    if (yearsOfExperience) doctor.yearsOfExperience = yearsOfExperience;
    if (hospitalAffiliations)
      doctor.hospitalAffiliations = hospitalAffiliations;
    if (consultationHours) doctor.consultationHours = consultationHours;
    if (education) doctor.education = education;
    if (certifications) doctor.certifications = certifications;

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a doctor by ID
router.delete("/doctor/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
