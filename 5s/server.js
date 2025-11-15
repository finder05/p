const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Question = require("./models/Question");
const Answer = require("./models/Answer");

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://localhost:27017/surveyDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));


async function seedQuestions() {
  const count = await Question.countDocuments();
  if (count === 0) {
    await Question.insertMany([
      { question: "What is your favorite color?" },
      { question: "What is your favorite food?" },
      { question: "Where do you like to travel?" },
      { question: "What is your favorite movie?" },
      { question: "What is your favorite hobby?" },
      { question: "Do you like pets?" },
      { question: "What is your dream job?" },
      { question: "What is your favorite book?" },
      { question: "Do you prefer coffee or tea?" },
      { question: "Do you like summer or winter?" },
    ]);
    console.log("🌱 Questions seeded.");
  }
}
seedQuestions();


app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/submit", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ message: "No answers received" });
    }

    // Prepare DB documents
    const answerDocs = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    
    await Answer.insertMany(answerDocs);

    // Fetch question texts for console formatting
    const questions = await Question.find({
      _id: { $in: Object.keys(answers) },
    });

    // -------- CLEAN OUTPUT (your request) --------
    console.log("==========================================");
    console.log("         📥 New Survey Submission");
    console.log("==========================================");

    questions.forEach((q) => {
      console.log("Q:", q.question);
      console.log("A:", answers[q._id]);
      console.log("------------------------------------------");
    });

    res.json({ message: "Answers submitted successfully!" });
  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ error: err.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
