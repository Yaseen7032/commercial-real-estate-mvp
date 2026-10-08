const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const { migrateLegacyPasswords } = require("./controllers/authController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requirements", require("./routes/requirementRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/contact-requests", require("./routes/contactRequestRoutes"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Locentra backend is running",
  });
});

require("./models/User");
require("./models/Property");
require("./models/Requirement");
require("./models/Favorite");
require("./models/ContactRequest");

app.use((error, req, res, next) => {
  console.error("API request failed:", error);
  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await migrateLegacyPasswords();
    app.listen(PORT, () => {
      console.log(`Locentra backend is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Locentra backend failed to start:", error.message);
    process.exitCode = 1;
  }
}

startServer();