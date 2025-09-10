const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token;

beforeAll(async () => {
  await pool.query("DELETE FROM users WHERE email = 'progressuser@example.com'");

  // Register & login
  await request(app).post("/auth/register").send({
    email: "progressuser@example.com",
    password: "123456",
    display_name: "Progress User",
  });

  const loginRes = await request(app).post("/auth/login").send({
    email: "progressuser@example.com",
    password: "123456",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Progress API", () => {
  it("should get user progress", async () => {
    const res = await request(app)
      .get("/progress")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user_id");
    expect(res.body).toHaveProperty("streak_days");
  });
it("should update user progress", async () => {
  const res = await request(app)
    .post("/progress/update")
    .set("Authorization", `Bearer ${token}`)
    .send({
      correctAnswers: 2,
      totalQuestions: 5,
    });

  expect(res.statusCode).toBe(200);

  // progress objesini kontrol et
  expect(res.body).toHaveProperty("progress");
  expect(res.body.progress).toHaveProperty("quizzes_taken");
  expect(res.body.progress.quizzes_taken).toBeGreaterThanOrEqual(1);

  // opsiyonel: badge kontrolü
  expect(res.body).toHaveProperty("new_badges");
  expect(Array.isArray(res.body.new_badges)).toBe(true);
});

});
