const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


const ProjectSchema = new mongoose.Schema({
title: String,
description: String,
tech: String,
github: String
});

const Project = mongoose.model("Project", ProjectSchema);


/* GET PROJECTS */

app.get("/api/projects", async (req,res)=>{

const projects = await Project.find();

res.json(projects);

});


/* INSERT DEFAULT PROJECTS */

app.get("/add-projects", async (req,res)=>{

await Project.deleteMany();

await Project.insertMany([

{
title:"Farmer Crop Planning & Advisory Tool",
description:"A smart agricultural assistant that helps farmers choose crops based on soil and season. It also detects plant diseases using leaf images.",
tech:"Node.js, Express.js, MongoDB, HTML, CSS, JavaScript",
github:"https://github.com/YOUR-GITHUB-USERNAME/farmer-advisory-tool"
},

{
title:"Personal Portfolio Website",
description:"A responsive full stack portfolio website to showcase projects and skills.",
tech:"HTML, CSS, JavaScript, Node.js",
github:"https://github.com/YOUR-GITHUB-USERNAME/portfolio-project"
}

]);

res.send("Projects Added");

});


app.listen(3000, ()=>{

console.log("Server running on port 5000");

});