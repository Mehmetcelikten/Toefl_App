// __tests__/health.test.js
const request = require("supertest");
const app = require("../src/app");

describe("Health Check", () => {
  it("should return ok:true", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
  });
});
