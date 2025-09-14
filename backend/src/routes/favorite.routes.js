const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/favorite.controller");
const authMiddleware = require("../middleware/auth.middleware");

// 🔹 Kullanıcının tüm favorileri
router.get("/", authMiddleware, FavoriteController.getFavorites);

// 🔹 Favori ekle
router.post("/", authMiddleware, FavoriteController.add);

// 🔹 Favori sil
router.delete("/:wordId", authMiddleware, FavoriteController.remove);

module.exports = router;
