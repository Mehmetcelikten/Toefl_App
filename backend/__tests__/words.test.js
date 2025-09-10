const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token;
let createdWordId;

beforeAll(async () => {
  await pool.query("DELETE FROM users WHERE email = 'wordstest@example.com'");
  await request(app).post("/auth/register").send({
    email: "wordstest@example.com",
    password: "123456",
    display_name: "Words Tester",
  });
  const login = await request(app).post("/auth/login").send({
    email: "wordstest@example.com",
    password: "123456",
  });
  token = login.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Words API", () => {
  it("should list all words", async () => {
    const res = await request(app)
      .get("/words")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new word", async () => {
    const res = await request(app)
      .post("/words")
      .set("Authorization", `Bearer ${token}`)
      .send({
        term: "ubiquitous",
        meaning: "present everywhere",
        example: "Smartphones are ubiquitous nowadays.",
        level: "C1",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.term).toBe("ubiquitous");
    createdWordId = res.body.id;
  });

  it("should get a word by ID", async () => {
    const res = await request(app)
      .get(`/words/${createdWordId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", createdWordId);
    expect(res.body.term).toBe("ubiquitous");
  });

  it("should return 404 for non-existent word ID", async () => {
    const res = await request(app)
      .get("/words/999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it("should update a word", async () => {
    const res = await request(app)
      .put(`/words/${createdWordId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        term: "ubiquitous-updated",
        meaning: "updated meaning",
        example: "Updated example",
        level: "B2",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.term).toBe("ubiquitous-updated");
  });

  it("should delete a word", async () => {
    const res = await request(app)
      .delete(`/words/${createdWordId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should fail to create word without meaning", async () => {
    const res = await request(app)
      .post("/words")
      .set("Authorization", `Bearer ${token}`)
      .send({ term: "incomplete" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
