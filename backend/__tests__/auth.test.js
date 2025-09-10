const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

beforeAll(async () => {
  // Test için DB temizliği (kayıt çakışmasın)
  await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
});

afterAll(async () => {
  await pool.end(); // DB bağlantısını kapat
});

describe("Auth API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "testuser@example.com",
        password: "123456",
        display_name: "Test User"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("testuser@example.com");
  });

  it("should login with registered user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "testuser@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // sonraki testlerde kullanacağız
  });

  it("should return profile with valid token", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });
});
