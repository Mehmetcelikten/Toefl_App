const express = require("express");
const router = express.Router();
const WordProgressController = require("../controllers/wordProgress.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/next", authMiddleware, WordProgressController.getNext);
router.post("/update", authMiddleware, WordProgressController.update);

module.exports = router;
