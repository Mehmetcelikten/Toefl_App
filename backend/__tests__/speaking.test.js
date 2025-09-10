const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token;
let promptId;

beforeAll(async () => {
  // Test user temizliği
  await pool.query("DELETE FROM users WHERE email = 'speaktest@example.com'");

  // Register → login → token
  await request(app).post("/auth/register").send({
    email: "speaktest@example.com",
    password: "password123",
    display_name: "Speaking Tester",
  });

  const res = await request(app).post("/auth/login").send({
    email: "speaktest@example.com",
    password: "password123",
  });
  token = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Speaking API", () => {
  it("should list all prompts", async () => {
    const res = await request(app)
      .get("/speaking/prompts")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      promptId = res.body[0].id;
    }
  });

  it("should get a prompt by ID", async () => {
    if (!promptId) return;
    const res = await request(app)
      .get(`/speaking/prompts/${promptId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(promptId);
  });

it("should submit a speaking attempt", async () => {
  if (!promptId) return;
  const res = await request(app)
    .post("/speaking/attempts")
    .set("Authorization", `Bearer ${token}`)
    .send({
      prompt_id: promptId,
      audio_key: "dummy_audio.mp3",
      transcript: "This is my speaking attempt for the test.",
    });
  expect(res.statusCode).toBe(201);

  // attempt objesini kontrol et
  expect(res.body).toHaveProperty("attempt");
  expect(res.body.attempt).toHaveProperty("id");
  expect(res.body.attempt.prompt_id).toBe(promptId);
  expect(res.body.attempt.transcript).toContain("speaking attempt");

  // progress ve badge kontrolü (opsiyonel ama güzel olur)
  expect(res.body).toHaveProperty("progress");
  expect(res.body).toHaveProperty("new_badges");
});

});
