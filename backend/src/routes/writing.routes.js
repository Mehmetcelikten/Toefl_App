const express = require("express");
const router = express.Router();
const WritingController = require("../controllers/writing.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.post("/attempts", authMiddleware, WritingController.createAttempt);
router.get("/attempts", authMiddleware, WritingController.getUserAttempts);
router.get("/attempts/:id", authMiddleware, WritingController.getAttemptById);

module.exports = router;
