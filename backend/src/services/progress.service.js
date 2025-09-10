const pool = require("../db");

class ProgressService {
  static async getByUser(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM progress WHERE user_id=$1",
      [userId]
    );

    if (rows[0]) {
      return rows[0];
    }

    // Eğer hiç progress kaydı yoksa sıfırdan başlat
    const { rows: insertRows } = await pool.query(
      `INSERT INTO progress(user_id, quizzes_taken, correct_answers, streak_days, last_activity)
       VALUES($1,0,0,0,CURRENT_DATE) RETURNING *`,
      [userId]
    );
    return insertRows[0];
  }

  static async updateAfterQuiz(userId, correctAnswers, totalQuestions) {
    const existing = await this.getByUser(userId);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let streakDays = 1;

    if (existing && existing.last_activity) {
      const last = new Date(existing.last_activity);
      const diffDays = Math.floor(
        (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        streakDays = existing.streak_days + 1;
      } else if (diffDays === 0) {
        streakDays = existing.streak_days; // aynı gün tekrar
      }
    }

    const { rows } = await pool.query(
      `UPDATE progress
       SET quizzes_taken = quizzes_taken + 1,
           correct_answers = correct_answers + $1,
           streak_days = $2,
           last_activity = $3
       WHERE user_id=$4
       RETURNING *`,
      [correctAnswers, streakDays, today, userId]
    );

    return rows[0];
  }
}

module.exports = ProgressService;
