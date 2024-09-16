const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cronJobs = require("./middlewares/cronJob");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());

// CORS configuration (adjust the origin as per your frontend)
app.use(cors({ origin: "http://localhost:3000" }));

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const userRoutes = require("./routes/userRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const caregiverRoutes = require("./routes/caregiverRoutes");
const appointmentsRoutes = require("./routes/appointmentRoutes");

app.use("/api/users", userRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/caregivers", caregiverRoutes);
app.use("/api/appointments", appointmentsRoutes);

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    console.log("OpenAI API Key:", process.env.OPENAI_API_KEY); // Add this to check if the API key is loaded
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
