const ReviewService = require("../services/review.service");

class ReviewController {
  static async getCards(req, res, next) {
    try {
      const userId = req.user.id;
      const { count = 5 } = req.query;
      const cards = await ReviewService.getCards(userId, parseInt(count));
      res.json(cards);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const { wordId, status } = req.body;

      const updated = await ReviewService.updateStatus(userId, wordId, status);

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async getQueue(req, res, next) {
    try {
      const userId = req.user.id;
      const queue = await ReviewService.getQueue(userId);
      res.json(queue);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewController;
