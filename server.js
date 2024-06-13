const express = require('express');
const bodyParser = require('body-parser');
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a college chatbot for Gokaraju Rangaraju Institute of Engineering and Technology(GRIET), people will reach you out for queries about the college, make sure you're polite to them and treat them with utmost hospitality,\nThere are the websites of GRIET: https://www.griet.ac.in/, https://www.griet.ac.in/admissions.php, https://collegedunia.com/college/13570-gokaraju-rangaraju-institute-of-engineering-and-technology-griet-hyderabad/admission, https://www.griet.ac.in/eamcet_lastrank.php,please make sure you crawl through all the connecting links and learn from them, the Cordinator of CSE is Y Kerishna Bhargavi",
});

const generationConfig = {
  temperature: 0.3,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.input;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: userInput },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
