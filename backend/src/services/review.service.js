const pool = require("../db");

class ReviewService {
  static async getCards(userId, count) {
    const { rows } = await pool.query(
      `SELECT id, term, meaning, example, level
       FROM words
       ORDER BY RANDOM()
       LIMIT $1`,
      [count]
    );
    return rows;
  }

  static async updateStatus(userId, wordId, status) {
    const delayMap = { known: 50, unknown: 5, unsure: 10 };
    const nextReviewIn = delayMap[status] || 5;

    await pool.query(
      `INSERT INTO review_queue(user_id, word_id, status, next_review_in)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, word_id)
       DO UPDATE SET status = $3, next_review_in = $4, updated_at = now()`,
      [userId, wordId, status, nextReviewIn]
    );

    return { success: true, wordId, status, nextReviewIn };
  }

  static async getQueue(userId) {
    const { rows } = await pool.query(
      `SELECT q.word_id, w.term, w.meaning, w.example, w.level,
              q.status, q.next_review_in, q.updated_at
       FROM review_queue q
       JOIN words w ON q.word_id = w.id
       WHERE q.user_id = $1
       ORDER BY q.updated_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = ReviewService;
