const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const SpeakingController = require("../controllers/speaking.controller");

// GET /speaking/prompts
router.get("/prompts", authMiddleware, SpeakingController.getPrompts);

// GET /speaking/prompts/:id
router.get("/prompts/:id", authMiddleware, SpeakingController.getPromptById);

// POST /speaking/attempts
router.post("/attempts", authMiddleware, SpeakingController.submitAttempt);

// GET /speaking/attempts (kendi denemeleri)
router.get("/attempts", authMiddleware, SpeakingController.getMyAttempts);

module.exports = router;
