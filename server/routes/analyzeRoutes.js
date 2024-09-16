const express = require("express");
const fs = require("fs");
const OpenAI = require("openai");
const User = require("../models/userSchema");
const path = require("path");
const pdfParse = require("pdf-parse");

const router = express.Router();

// Initialize OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have this in your .env file
});

// Endpoint to analyze the PDF file
router.post("/", async (req, res) => {
  const { userId, fileId } = req.body;

  try {
    // Find the user and get the file details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the file by its ID
    const file = user.files.find((f) => f._id.toString() === fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Use `path.join()` to create an absolute path to the file
    const filePath = path.join(__dirname, "../uploads", file.name);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ error: "File does not exist on the server" });
    }

    // Read the uploaded file (binary PDF)
    const fileBuffer = fs.readFileSync(filePath);

    // Extract text from the PDF file using pdf-parse
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text;

    // Send the extracted text to OpenAI for analysis
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a document analyzer that extracts key points from PDF or text files.",
        },
        {
          role: "user",
          content: `Analyze the following document and provide the main key points: \n${extractedText}`,
        },
      ],
      max_tokens: 500,
    });

    // Get the document analysis from OpenAI
    const analysis = analysisResponse.choices[0].message.content;

    // Save the analysis in the database
    file.analysis = analysis;
    await user.save();

    // Respond with the document analysis
    res.json({ analysis });
  } catch (error) {
    console.error("Error analyzing file:", error);
    res.status(500).json({ error: "Error analyzing the file." });
  }
});

// Endpoint to perform a risk analysis based on the previous document analysis
router.post("/risk", async (req, res) => {
  const { userId, fileId, businessInfo } = req.body;

  try {
    // Find the user and get the file details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the file by its ID
    const file = user.files.find((f) => f._id.toString() === fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!file.analysis) {
      return res.status(400).json({
        error: "Document analysis must be performed before risk analysis.",
      });
    }

    // Prompt OpenAI for risk analysis based on the document's analysis
    const risksResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that assists users in analyzing business documents for potential risks based on business ingfo.",
        },
        {
          role: "user",
          content: `Here is the document analysis: ${file.analysis}. Please perform a risk analysis based on ${businessInfo}.`,
        },
      ],
      max_tokens: 500,
    });

    const riskAnalysis = risksResponse.choices[0].message.content;

    // Save the risk analysis in the database
    file.riskAnalysis = riskAnalysis;
    await user.save();

    // Respond with the risk analysis
    res.json({ riskAnalysis });
  } catch (error) {
    console.error("Error performing risk analysis:", error);
    res.status(500).json({ error: "Error performing risk analysis." });
  }
});

// Endpoint to handle conversation about the document
router.post("/conversation", async (req, res) => {
  const { userId, fileId, question } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const file = user.files.find((f) => f._id.toString() === fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send the user's question to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;

    // Save the conversation in the database
    file.conversation.push({
      question,
      response: reply,
    });
    await user.save();

    res.json({ response: reply });
  } catch (error) {
    console.error("Error handling conversation:", error);
    res.status(500).json({ error: "Error processing the conversation." });
  }
});

module.exports = router;
