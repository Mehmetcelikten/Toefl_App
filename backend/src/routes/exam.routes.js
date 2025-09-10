const express = require("express");
const router = express.Router();

const ExamController = require("../controllers/exam.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Tüm sınavlar
router.get("/", authMiddleware, ExamController.getAll);

// Tek sınav
router.get("/:id", authMiddleware, ExamController.getById);

// Sınav gönderme
router.post("/:id/submit", authMiddleware, ExamController.submit);

module.exports = router;
