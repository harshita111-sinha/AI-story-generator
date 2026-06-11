require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/generate", async (req, res) => {

    const { prompt, genre } = req.body;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a ${genre} story about ${prompt}`
        });

        res.json({
            story: response.text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate story"
        });
    }
});

app.post("/modify", async (req, res) => {

    const { story, feedback } = req.body;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
Story:
${story}

User feedback:
${feedback}

Modify the story according to the feedback and return only the updated story.
`
        });

        res.json({
            story: response.text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to modify story"
        });
    }
});

app.listen(5000, () => {
    console.log("Server Running");
});