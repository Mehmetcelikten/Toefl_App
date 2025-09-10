const ExamService = require("../services/exam.service");
const ProgressService = require("../services/progress.service");
const BadgeService = require("../services/badge.service");

class ExamController {
  // GET /exams?type=reading|listening
  static async getAll(req, res, next) {
    try {
      const { type } = req.query;
      const exams = await ExamService.getAll(type);
      return res.json(exams);
    } catch (err) {
      next(err);
    }
  }

  // GET /exams/:id
  static async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid exam ID" });
      }

      const exam = await ExamService.getById(id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

      return res.json(exam);
    } catch (err) {
      next(err);
    }
  }

  // POST /exams/:id/submit
  // Body: { answers: [0,1,2...] }
  static async submit(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid exam ID" });
      }

      const { answers } = req.body;
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Answers array required" });
      }

      const userId = req.user.id; // authMiddleware’den geliyor
      const result = await ExamService.submit(id, userId, answers);

      if (!result) {
        return res.status(404).json({ error: "Exam not found" });
      }

      // ✅ Progress & Badges güncelle
      const progress = await ProgressService.updateAfterQuiz(
        userId,
        result.raw_score,
        result.max_score
      );
      const newBadges = await BadgeService.checkAndGrant(userId, progress);

      return res.json({
        exam_id: result.exam_id,
        user_id: result.user_id,
        raw_score: result.raw_score,
        max_score: result.max_score,
        scaled_score: result.scaled_score,
        progress,
        new_badges: newBadges,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExamController;
