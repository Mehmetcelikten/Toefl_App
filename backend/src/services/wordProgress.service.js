const pool = require("../db");

class WordProgressService {
  static async getNextWord(userId) {
    const result = await pool.query(
      `
      SELECT w.*, wp.status, wp.seen_count
      FROM words w
      LEFT JOIN word_progress wp 
        ON wp.word_id = w.id AND wp.user_id = $1
      WHERE wp.next_review_at IS NULL OR wp.next_review_at <= now()
      ORDER BY random()
      LIMIT 1
      `,
      [userId]
    );
    return result.rows[0];
  }

  static async updateProgress(userId, wordId, status) {
    let interval = "5 minutes"; // default tekrar
    if (status === "known") interval = "50 minutes";
    if (status === "unknown") interval = "5 minutes";
    if (status === "unsure") interval = "10 minutes";

    const result = await pool.query(
      `
      INSERT INTO word_progress(user_id, word_id, status, seen_count, next_review_at)
      VALUES ($1, $2, $3, 1, now() + $4::interval)
      ON CONFLICT (user_id, word_id)
      DO UPDATE SET 
        status = EXCLUDED.status,
        seen_count = word_progress.seen_count + 1,
        next_review_at = now() + $4::interval
      RETURNING *
      `,
      [userId, wordId, status, interval]
    );

    return result.rows[0];
  }
}

module.exports = WordProgressService;
