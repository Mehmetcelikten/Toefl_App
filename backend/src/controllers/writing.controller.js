const WritingService = require("../services/writing.service");
const ProgressService = require("../services/progress.service");
const BadgeService = require("../services/badge.service");

class WritingController {
  // POST /writing/attempts
  static async createAttempt(req, res, next) {
    try {
      const userId = req.user.id; // authMiddleware
      const { question, response } = req.body;

      if (!question || !response) {
        return res
          .status(400)
          .json({ error: "Question and response are required" });
      }

      // 🟡 Dummy scoring (örnek: kelime sayısına göre)
      const wordCount = response.trim().split(/\s+/).length;
      const score_content = Math.min(5, Math.floor(wordCount / 50)); // 0–5
      const score_grammar = 3; // dummy
      const score_vocabulary = 3; // dummy
      const feedback =
        "Good effort! Try to expand your ideas and check grammar.";

      const attempt = await WritingService.createAttempt({
        user_id: userId,
        question,
        response,
        score_content,
        score_grammar,
        score_vocabulary,
        feedback,
      });

      // ✅ Progress & Badges update
      const progress = await ProgressService.updateAfterQuiz(
        userId,
        score_content + score_grammar + score_vocabulary, // toplam puan
        15 // 3 kriter x max 5 puan = 15
      );
      const newBadges = await BadgeService.checkAndGrant(userId, progress);

      return res.status(201).json({
        attempt,
        progress,
        new_badges: newBadges,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /writing/attempts
  static async getUserAttempts(req, res, next) {
    try {
      const userId = req.user.id;
      const attempts = await WritingService.getAttemptsByUser(userId);
      return res.json(attempts);
    } catch (err) {
      next(err);
    }
  }

  // GET /writing/attempts/:id
  static async getAttemptById(req, res, next) {
    try {
      const attempt = await WritingService.getAttemptById(req.params.id);
      if (!attempt) {
        return res.status(404).json({ error: "Attempt not found" });
      }
      return res.json(attempt);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WritingController;
