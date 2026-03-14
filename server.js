const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5002;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "usha1126";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/api/projects", async (req, res, next) => {
  try {
    // Allowlist of repositories to show as project cards.
    // Include the previous farmer advisory repo name so we can
    // safely remap it to the new AgroTecX project details.
    const allowedNames = new Set([
      "Agrotecx",
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
      .map((repo) => {
        // Remap the old farmer advisory tool entry to the new AgroTecX
        // title and GitHub link so it shows correctly in the projects
        // section even if the underlying repo name hasn't been renamed yet.
        if (repo.name === "farmer_advisory_tool" || repo.name === "Agrotecx") {
          return {
            title: "AgroTecX — Farmer Advisory Tool",
            github: "https://github.com/usha1126/Agrotecx",
          };
        }

        return {
          title: repo.name,
          github: repo.html_url,
        };
      });

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