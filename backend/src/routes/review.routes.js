const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const ReviewController = require("../controllers/review.controller");

router.use(authMiddleware);

// Kart çekme
router.get("/cards", ReviewController.getCards);

// Kullanıcının ilerlemesini güncelleme
router.post("/update", ReviewController.updateStatus);

// Kuyruğu listele
router.get("/queue", ReviewController.getQueue);

module.exports = router;
