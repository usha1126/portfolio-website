async function loadProjects(){

const response = await fetch("/api/projects");

const projects = await response.json();

const container = document.getElementById("projectContainer");

projects.forEach(project => {

const div = document.createElement("div");

div.className = "project";

div.innerHTML = `

<h3>${project.title}</h3>

<p>${project.description}</p>

<p><b>Tech:</b> ${project.tech}</p>

<a href="${project.github}" target="_blank">View Project</a>

`;

container.appendChild(div);

});

}

loadProjects();