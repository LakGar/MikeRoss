const express = require("express");
const OpenAI = require("openai");
const app = express();
app.use(express.json());

// Correct way to initialize the configuration
const openai = new OpenAI({
  apiKey:
    "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",
});

app.get("/get", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "How are you feeling today?",
        },
      ],
      max_tokens: 50,
    });

    // Access the response properly
    const result = response.choices[0].message.content;
    console.log(result);
    res.send(result); // Send the response back to the client
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
