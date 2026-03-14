async function loadProjects() {
  const container = document.getElementById("projectContainer");

  if (!container) {
    console.warn('Element with id "projectContainer" not found.');
    return;
  }

  container.innerHTML = "";

  try {
    const response = await fetch("/api/projects");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const projects = await response.json();

    if (!projects.length) {
      container.textContent = "No matching GitHub projects found.";
      return;
    }

    projects.forEach((project) => {
      const div = document.createElement("div");

      div.className = "project";

      div.innerHTML = `
        <h3>${project.title}</h3>
        <div class="project-actions">
          <a
            href="${project.github}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm btn-project"
          >
            View Project
          </a>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
    container.textContent =
      "Failed to load projects. Please try again later.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
});