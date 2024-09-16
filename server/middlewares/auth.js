const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Log the token for debugging purposes
    console.log("Received token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach only the user's ID to the request object
    req.userId = decoded.id;
    console.log("User ID from token:", req.userId);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Authorization denied" });
    }

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
