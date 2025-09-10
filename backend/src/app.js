const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const wordRoutes = require("./routes/word.routes");
const examRoutes = require("./routes/exam.routes");
const speakingRoutes = require("./routes/speaking.routes");
const writingRoutes = require("./routes/writing.routes"); // ✅ eklendi
const progressRoutes = require("./routes/progress.routes");
const badgeRoutes = require("./routes/badge.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Routes
app.use("/auth", authRoutes);
app.use("/words", wordRoutes);
app.use("/exams", examRoutes);
app.use("/speaking", speakingRoutes);
app.use("/writing", writingRoutes); // ✅ yeni route eklendi
app.use("/progress", progressRoutes);
app.use("/badges", badgeRoutes);

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
