const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const auth = require("../middlewares/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create the upload directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"));
    }
    cb(null, true);
  },
});

const router = express.Router();

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// User registration
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to add a file to a user (requires auth)
router.post(
  "/:userId/files",
  auth,
  (req, res, next) => {
    console.log("Received request, running multer middleware...");
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    console.log("Multer completed, now processing file...");
    const { userId } = req.params;
    const { tags, starred } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${file.filename}`; // Store the relative file path

    const fileData = {
      name: file.filename,
      size: file.size,
      filePath, // Add the file path to the file data
      tags: tags ? tags.split(",") : [],
      starred: starred === "true",
      createdAt: new Date(),
    };

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.files.push(fileData);
      await user.save();
      res.status(200).json(user.files);
    } catch (error) {
      console.error("Error adding file:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to delete a file from a user (requires auth)
router.delete("/:userId/files/:fileId", auth, async (req, res) => {
  const { userId, fileId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fileToDelete = user.files.find(
      (file) => file._id.toString() === fileId
    );
    if (!fileToDelete) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", fileToDelete.name);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file from filesystem:", err);
        }
      });
    }

    user.files = user.files.filter((file) => file._id.toString() !== fileId);
    await user.save();

    res.status(200).json(user.files);
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to star/unstar a file (requires auth)
router.put("/:userId/files/:fileId/star", auth, async (req, res) => {
  const { userId, fileId } = req.params;
  const { isStarred } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, "files._id": fileId },
      { $set: { "files.$.starred": isStarred } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or file not found" });
    }

    res.status(200).json(user.files);
  } catch (error) {
    console.error("Error starring/un-starring file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
