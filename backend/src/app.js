const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const wordRoutes = require("./routes/word.routes");
const examRoutes = require("./routes/exam.routes");
const speakingRoutes = require("./routes/speaking.routes");
const writingRoutes = require("./routes/writing.routes");
const progressRoutes = require("./routes/progress.routes");
const badgeRoutes = require("./routes/badge.routes");
const uploadRoutes = require("./routes/upload.routes"); // ✅ eklendi
const favoriteRoutes = require("./routes/favorite.routes");
const wordProgressRoutes = require("./routes/wordProgress.routes");
const reviewRoutes = require("./routes/review.routes");





const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Static uploads klasörü (audio dosyaları erişilebilir olacak)
app.use("/uploads", express.static("uploads")); // ✅ eklendi

// Routes
app.use("/auth", authRoutes);
app.use("/words", wordRoutes);
app.use("/exams", examRoutes);
app.use("/speaking", speakingRoutes);
app.use("/writing", writingRoutes);
app.use("/progress", progressRoutes);
app.use("/badges", badgeRoutes);
app.use("/upload", uploadRoutes); // ✅ eklendi
app.use("/favorites", favoriteRoutes);
app.use("/word-progress", wordProgressRoutes);
app.use("/review", reviewRoutes);


// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error:", err);
  }

  res.status(status).json({ error: message });
});

module.exports = app;
