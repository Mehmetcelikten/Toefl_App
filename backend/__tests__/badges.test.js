const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

let token;

beforeAll(async () => {
  await pool.query("DELETE FROM users WHERE email = 'badgeuser@example.com'");

  // Register & login
  await request(app).post("/auth/register").send({
    email: "badgeuser@example.com",
    password: "123456",
    display_name: "Badge User",
  });

  const loginRes = await request(app).post("/auth/login").send({
    email: "badgeuser@example.com",
    password: "123456",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Badges API", () => {
  it("should return user badges (possibly empty)", async () => {
    const res = await request(app)
      .get("/badges")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
