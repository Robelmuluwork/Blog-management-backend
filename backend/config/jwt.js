module.exports = {
  secret: process.env.JWT_SECRET || "secret",
  expiresIn: process.env.JWT_EXPIRES_IN || "5h",
};
