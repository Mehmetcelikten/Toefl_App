const { Pool } = require("pg");
const dotenv = require("dotenv");

// Ortama göre doğru .env dosyasını yükle
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST || "localhost",
  port: process.env.DB_PORT || process.env.PGPORT || 5432,
  user: process.env.DB_USER || process.env.PGUSER || "postgres",
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || "postgres",
  database: process.env.DB_NAME || process.env.PGDATABASE || "toefl"
});

pool.on("connect", () => {
  console.log(`✅ Connected to PostgreSQL [${process.env.DB_NAME || process.env.PGDATABASE}]`);
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PG error", err);
  process.exit(-1);
});

module.exports = pool;
