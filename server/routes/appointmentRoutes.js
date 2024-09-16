const express = require("express");
const Appointment = require("../models/appointmentSchema");
const User = require("../models/userSchema");

const auth = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Add a new appointment
router.post("/appointment", auth, async (req, res) => {
  const { doctor, patient, date, time, status, notes, createdBy } = req.body;

  if (!doctor || !patient || !createdBy) {
    console.error("Missing required fields", { doctor, patient, createdBy });
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    console.error("Invalid doctor ID:", doctor);
    return res.status(400).json({ message: "Invalid doctor ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(patient)) {
    console.error("Invalid patient ID:", patient);
    return res.status(400).json({ message: "Invalid patient ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    console.error("Invalid createdBy ID:", createdBy);
    return res.status(400).json({ message: "Invalid createdBy ID" });
  }

  console.log("Creating appointment:", { doctor, patient, createdBy });

  try {
    const appointment = new Appointment({
      doctor,
      patient,
      createdBy,
      date,
      time,
      status,
      notes,
    });
    console.log("Doctor ID:", doctor, typeof doctor);
    console.log("Patient ID:", patient, typeof patient);
    console.log("Created By ID:", createdBy, typeof createdBy);
    const savedAppointment = await appointment.save();
    console.log("Appointment created:", savedAppointment);

    const doctorUser = await User.findById(doctor);
    if (!doctorUser) {
      console.error("Doctor not found:", doctor);
      return res.status(404).json({ message: "Assigned doctor not found" });
    }
    doctorUser.appointment = doctorUser.appointment || [];
    doctorUser.appointment.push(savedAppointment._id);
    await doctorUser.save();
    console.log("Appointment added to doctor");

    const patientUser = await User.findById(patient);
    if (!patientUser) {
      console.error("Patient not found:", patient);
      return res.status(404).json({ message: "Assigned patient not found" });
    }
    patientUser.appointment = patientUser.appointment || [];
    patientUser.appointment.push(savedAppointment._id);
    await patientUser.save();
    console.log("Appointment added to patient");

    const caregiverUser = await User.findById(createdBy);
    if (!caregiverUser) {
      console.error("Caregiver not found:", createdBy);
      return res.status(404).json({ message: "Assigned caregiver not found" });
    }
    caregiverUser.appointment = caregiverUser.appointment || [];
    caregiverUser.appointment.push(savedAppointment._id);
    await caregiverUser.save();
    console.log("Appointment added to caregiver");

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Error in appointment creation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all appointments
router.get("/", auth, async (req, res) => {
  const userId = req.userId; // Retrieve userId from the request
  try {
    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }, { createdBy: userId }],
    })
      .populate("doctor", "specialization")
      .populate("patient", "medicalInformation");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get an appointment by ID
router.get("/appointment/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id)
      .populate("doctor", "specialization")
      .populate("patient", "medicalInformation");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an appointment by ID
router.put("/appointment/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { doctor, patient, date, time, status, notes } = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (doctor) appointment.doctor = doctor;
    if (patient) appointment.patient = patient;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an appointment by ID
router.delete("/appointment/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
