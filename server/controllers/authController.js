const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtSecret = require("../config/jwt");

const passwordSaltRounds = 12;
const maximumPasswordBytes = 72;
const validRoles = new Set(["retailer", "tenantRepresentative"]);
const bcryptHashPattern = /^\$2[aby]\$\d{2}\$/;

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register(req, res, next) {
  const { name, email, password, role } = req.body || {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password ||
    typeof role !== "string" ||
    !role
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, and role are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!validEmail(normalizedEmail)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address." });
  }
  if (!validRoles.has(role)) {
    return res.status(400).json({ success: false, message: "Choose a valid account role." });
  }
  if (Buffer.byteLength(password, "utf8") > maximumPasswordBytes) {
    return res.status(400).json({
      success: false,
      message: "Password must be 72 bytes or fewer.",
    });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail }).select("_id");
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please sign in.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (!bcryptHashPattern.test(user.password)) {
      return res.status(401).json({
        success: false,
        message: "This development account uses an outdated password format. Please create a new account.",
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("name email role createdAt");
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function migrateLegacyPasswords() {
  let migratedCount = 0;
  const users = User.find({}).select("+password").cursor();
  for await (const user of users) {
    if (bcryptHashPattern.test(user.password)) continue;
    const hashedPassword = await bcrypt.hash(user.password, passwordSaltRounds);
    const result = await User.updateOne(
      { _id: user._id, password: user.password },
      { $set: { password: hashedPassword } }
    );
    if (result.modifiedCount) migratedCount += 1;
  }
  if (migratedCount) {
    console.log(`Securely migrated ${migratedCount} legacy password record(s).`);
  }
}

module.exports = { getProfile, login, migrateLegacyPasswords, register, jwtSecret };
