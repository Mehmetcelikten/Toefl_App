const FavoriteService = require("../services/favorite.service");

class FavoriteController {
  static async getFavorites(req, res, next) {
    try {
      const userId = req.user.id;
      const favorites = await FavoriteService.getUserFavorites(userId);
      res.json(favorites);
    } catch (err) {
      next(err);
    }
  }

  static async add(req, res, next) {
    try {
      const userId = req.user.id;
      const { wordId } = req.body;
      const fav = await FavoriteService.addFavorite(userId, wordId);
      res.status(201).json(fav || { message: "Already in favorites" });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      const userId = req.user.id;
      const { wordId } = req.params;
      const fav = await FavoriteService.removeFavorite(userId, wordId);
      if (!fav) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FavoriteController;
