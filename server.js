const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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", // ⚠️ use new key
  baseURL: "https://integrate.api.nvidia.com/v1"
});

app.get("/", (req, res) => {
  res.send("✅ Backend is working");
});

app.post("/chat", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "user", content: req.body.message }
      ],
      temperature: 1,
      top_p: 1,
      max_tokens: 500,
      stream: false // ✅ IMPORTANT FIX
    });

    const reply =
      completion.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (err) {
    console.error("❌ ERROR:", err);

    res.status(500).json({
      error: err.message || "Something went wrong"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
