const crypto = require("node:crypto");

module.exports = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
