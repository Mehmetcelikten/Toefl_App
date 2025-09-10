const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Şifreyi hashle
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Şifreyi doğrula
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
