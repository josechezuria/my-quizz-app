import express from "express";
import axios from "axios";
import he from "he";
const router = express.Router();

// Route for quiz categories (GET request)
router.get("/:category", async (req, res) => {
  const categoryName = req.params.category;
  const decodedCategoryName = decodeURIComponent(categoryName);

  const categoryMapping = {
    "General Knowledge": 9,
    "Entertainment: Film": 11,
    "Entertainment: Music": 12,
    "Entertainment: Television": 14,
  };

  if (!categoryMapping[decodedCategoryName]) {
    return res.send("Invalid category");
  }

  const categoryId = categoryMapping[decodedCategoryName];

  try {
    const response = await axios.get(`https://opentdb.com/api.php?amount=10&category=${categoryId}`);

    // Decode all question and answer text
    const questions = response.data.results.map(question => ({
      ...question,
      question: he.decode(question.question), // Decode question text
      correct_answer: he.decode(question.correct_answer), // Decode correct answer
      incorrect_answers: question.incorrect_answers.map(answer => he.decode(answer)), // Decode incorrect answers
    }));

    // ✅ Store questions in session so they persist for the POST request
    req.session.questions = questions;

    res.render("quiz", { category: decodedCategoryName, questions });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    res.send("Error fetching quiz data");
  }
});

// Handle quiz form submission (POST request)
router.post("/:category", (req, res) => {
  const categoryName = req.params.category;
  const decodedCategoryName = decodeURIComponent(categoryName);

  // 🛑 Fix: Ensure session has questions stored
  if (!req.session.questions) {
    return res.send("No quiz data found. Please start again.");
  }

  const questions = req.session.questions;
  const userAnswers = req.body.answers; // Ensure the frontend sends answers as an array

  let score = 0;
  questions.forEach((question, index) => {
    if (userAnswers[index] === question.correct_answer) {
      score++;
    }
  });

  // ✅ Store the score in session (optional, for later use)
  req.session.score = score;

  res.render("result", { category: decodedCategoryName, score, total: questions.length });
});

// Route for the main dashboard
router.get("/", (req, res) => {
  const score = req.session.score || 0; // Default to 0 if no score exists
  res.render("index", { score });
});

export { router };
