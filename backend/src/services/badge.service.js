const pool = require("../db");

class BadgeService {
  static async getByUser(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM badges WHERE user_id=$1 ORDER BY earned_at DESC",
      [userId]
    );
    return rows;
  }

  static async grantBadge(userId, badgeName) {
    const { rows } = await pool.query(
      `INSERT INTO badges(user_id, badge_name)
       VALUES($1,$2) RETURNING *`,
      [userId, badgeName]
    );
    return rows[0];
  }

  // basit kurallar
  static async checkAndGrant(userId, progress) {
    const badges = [];

    if (progress.quizzes_taken === 1) {
      badges.push(await this.grantBadge(userId, "First Step"));
    }
    if (progress.streak_days === 7) {
      badges.push(await this.grantBadge(userId, "7-Day Streak"));
    }
    if (progress.correct_answers >= 100) {
      badges.push(await this.grantBadge(userId, "Century Club"));
    }

    return badges;
  }
}

module.exports = BadgeService;
