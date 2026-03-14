const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "usha1126";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/api/projects", async (req, res, next) => {
  try {
    const allowedNames = new Set([
      "farmer_advisory_tool",
      "portfolio-website",
      "account-creation-form",
      "plaintext-to-ciphertext-converter",
    ]);

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const repos = await response.json();

    const projects = repos
      .filter((repo) => allowedNames.has(repo.name))
      .map((repo) => ({
        title: repo.name,
        github: repo.html_url,
      }));

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});