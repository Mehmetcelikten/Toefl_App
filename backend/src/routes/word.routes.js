const express = require("express");
const router = express.Router();

const WordController = require("../controllers/word.controller");
const authMiddleware = require("../middleware/auth.middleware");

// 🔹 Tüm kelimeler (pagination destekli)
// GET /words?limit=50&offset=0
router.get("/", authMiddleware, WordController.getAll);

// 🔹 ID'ye göre kelime
// GET /words/:id
router.get("/:id", authMiddleware, WordController.getById);

// 🔹 Yeni kelime ekle
// POST /words
router.post("/", authMiddleware, WordController.create);

// 🔹 Kelime güncelle
// PUT /words/:id
router.put("/:id", authMiddleware, WordController.update);

// 🔹 Kelime sil
// DELETE /words/:id
router.delete("/:id", authMiddleware, WordController.delete);

// 🔹 Rastgele kelimeler (quiz için)
// GET /words/random?count=10
router.get("/random/list", authMiddleware, WordController.getRandom);

module.exports = router;
