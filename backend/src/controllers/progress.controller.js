const ProgressService = require("../services/progress.service");
const BadgeService = require("../services/badge.service");

class ProgressController {
  static async getUserProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const progress = await ProgressService.getByUser(userId);
      return res.json(progress || {});
    } catch (err) {
      next(err);
    }
  }

  // Bu fonksiyon exam.submit veya speaking.submit sonrası çağrılmalı
  static async updateProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const { correctAnswers, totalQuestions } = req.body;

      if (typeof correctAnswers !== "number" || typeof totalQuestions !== "number") {
        return res.status(400).json({ error: "Invalid body" });
      }

      const progress = await ProgressService.updateAfterQuiz(
        userId,
        correctAnswers,
        totalQuestions
      );

      const badges = await BadgeService.checkAndGrant(userId, progress);

      return res.json({ progress, new_badges: badges });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProgressController;
