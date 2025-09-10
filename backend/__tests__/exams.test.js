const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token;
let examId;

beforeAll(async () => {
  // Test user temizliği
  await pool.query("DELETE FROM users WHERE email = 'examtest@example.com'");

  // Register → login → token
  await request(app).post("/auth/register").send({
    email: "examtest@example.com",
    password: "password123",
    display_name: "Exam Tester",
  });

  const res = await request(app).post("/auth/login").send({
    email: "examtest@example.com",
    password: "password123",
  });
  token = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Exams API", () => {
  it("should list all exams", async () => {
    const res = await request(app)
      .get("/exams")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      examId = res.body[0].id;
    }
  });

  it("should get exam by ID", async () => {
    if (!examId) return;
    const res = await request(app)
      .get(`/exams/${examId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(examId);
  });

  it("should submit answers and return a score", async () => {
    if (!examId) return;
    const res = await request(app)
      .post(`/exams/${examId}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({ answers: [0, 1, 2, 3] }); // dummy cevaplar
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("scaled_score");
    expect(typeof res.body.scaled_score).toBe("number");
  });
});
