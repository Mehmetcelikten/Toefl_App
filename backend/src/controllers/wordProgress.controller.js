const WordProgressService = require("../services/wordProgress.service");

class WordProgressController {
  static async getNext(req, res, next) {
    try {
      const word = await WordProgressService.getNextWord(req.user.id);
      if (!word) return res.json({ message: "No words available" });
      res.json(word);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { wordId, status } = req.body;
      if (!["known", "unknown", "unsure"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const updated = await WordProgressService.updateProgress(
        req.user.id,
        wordId,
        status
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WordProgressController;
