const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token;
let attemptId;

beforeAll(async () => {
  await request(app).post("/auth/register").send({
    email: "writinguser@example.com",
    password: "test123",
    display_name: "Writer User",
  });

  const res = await request(app).post("/auth/login").send({
    email: "writinguser@example.com",
    password: "test123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Writing API", () => {
  it("should create a new writing attempt", async () => {
    const res = await request(app)
      .post("/writing/attempts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Do you agree or disagree with the following statement?",
        response: "I completely agree with the statement because...",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("attempt");
    expect(res.body.attempt).toHaveProperty("id");
    expect(res.body.attempt.response).toContain("agree");

    attemptId = res.body.attempt.id;
  });

  it("should list user writing attempts", async () => {
    const res = await request(app)
      .get("/writing/attempts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a writing attempt by ID", async () => {
    const res = await request(app)
      .get(`/writing/attempts/${attemptId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", attemptId);
    expect(res.body).toHaveProperty("response");
  });
});
