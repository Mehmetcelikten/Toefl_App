const BadgeService = require("../services/badge.service");

class BadgeController {
  static async getUserBadges(req, res, next) {
    try {
      const userId = req.user.id;
      const badges = await BadgeService.getByUser(userId);
      return res.json(badges);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BadgeController;
