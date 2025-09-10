const SpeakingService = require("../services/speaking.service");
const ProgressService = require("../services/progress.service");
const BadgeService = require("../services/badge.service");

class SpeakingController {
  // GET /speaking/prompts
  static async getPrompts(req, res, next) {
    try {
      const prompts = await SpeakingService.getPrompts();
      return res.json(prompts);
    } catch (err) {
      next(err);
    }
  }

  // GET /speaking/prompts/:id
  static async getPromptById(req, res, next) {
    try {
      const { id } = req.params;
      const prompt = await SpeakingService.getPromptById(id);
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      return res.json(prompt);
    } catch (err) {
      next(err);
    }
  }

  // POST /speaking/attempts
  // Body: { prompt_id, audio_key, transcript }
  static async submitAttempt(req, res, next) {
    try {
      const userId = req.user.id;
      const { prompt_id, audio_key, transcript } = req.body;

      if (!prompt_id || !audio_key) {
        return res.status(400).json({ error: "Prompt and audio are required" });
      }

      // 🟡 Dummy scoring (ileride gerçek model entegre edilebilir)
      const wordCount = transcript ? transcript.split(/\s+/).length : 0;
      const score = Math.min(30, Math.floor(wordCount / 5));

      const attempt = await SpeakingService.createAttempt({
        user_id: userId,
        prompt_id,
        audio_key,
        transcript,
        wpm: wordCount, // basit metrik
        score_fluency: score,
        score_pronunciation: score,
        score_grammar: score,
        score_vocabulary: score,
        score_task: score,
        scaled_score: score,
        feedback_json: { note: "Auto feedback (dummy)" },
      });

      // ✅ Progress & Badges güncelle
      const progress = await ProgressService.updateAfterQuiz(
        userId,
        score, // doğru sayısı yerine dummy skor
        30     // max score = 30
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

  // GET /speaking/attempts (kullanıcının kendi denemeleri)
  static async getMyAttempts(req, res, next) {
    try {
      const userId = req.user.id;
      const attempts = await SpeakingService.getAttemptsByUser(userId);
      return res.json(attempts);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SpeakingController;
