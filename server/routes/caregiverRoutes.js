const express = require("express");
const Caregiver = require("../models/caregiverSchema");
const User = require("../models/userSchema");
const auth = require("../middlewares/auth");

const router = express.Router();

// Add a new caregiver
router.post("/caregiver", auth, async (req, res) => {
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
    const caregiver = new Caregiver({
      patient,
      specialization,
      yearsOfExperience,
      hospitalAffiliations,
      consultationHours,
      education,
      certifications,
    });

    const savedCaregiver = await caregiver.save();

    const user = await User.findById(userId);
    user.caregiverInfo = savedCaregiver._id;
    await user.save();
    res.status(201).json(caregiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all caregivers
router.get("/caregivers", auth, async (req, res) => {
  try {
    const caregivers = await Caregiver.find().populate("patient", "-password");
    res.json(caregivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a caregiver by ID
router.get("/caregiver/:id", auth, async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to get caregiver with ID: ${id}`);

  try {
    console.log(`Fetching caregiver details for ID: ${id}`);
    const caregiver = await Caregiver.findById(id).populate(
      "patient",
      "-password"
    );

    if (!caregiver) {
      console.log(`No caregiver found with ID: ${id}`);
      return res.status(404).json({ message: "Caregiver not found" });
    }

    console.log(`Caregiver details retrieved successfully for ID: ${id}`);
    res.json(caregiver);
  } catch (err) {
    console.error(
      `Error occurred while fetching caregiver details for ID: ${id}`,
      err
    );
    res.status(500).json({ message: "Server error" });
  }
});

// Update a caregiver by ID
router.put("/caregiver/:id", auth, async (req, res) => {
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
    const caregiver = await Caregiver.findById(id);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    if (patient) caregiver.patient = patient;
    if (specialization) caregiver.specialization = specialization;
    if (yearsOfExperience) caregiver.yearsOfExperience = yearsOfExperience;
    if (hospitalAffiliations)
      caregiver.hospitalAffiliations = hospitalAffiliations;
    if (consultationHours) caregiver.consultationHours = consultationHours;
    if (education) caregiver.education = education;
    if (certifications) caregiver.certifications = certifications;

    await caregiver.save();
    res.json(caregiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a caregiver by ID
router.delete("/caregiver/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const caregiver = await Caregiver.findByIdAndDelete(id);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    res.json({ message: "Caregiver deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/patients", auth, async (req, res) => {
  const { id } = req.params;
  console.log("fetching patients");
  try {
    // Find the caregiver by ID and populate the patient array
    const caregiver = await Caregiver.findById(id).populate({
      path: "patient", // This should match the field name in the Caregiver schema
      model: "User", // The model name for the referenced patient documents
      select: "-password", // Exclude the password field from the patient documents
    });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    // Extract the populated patient data
    const patients = caregiver.patient;
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
