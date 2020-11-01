const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoriesId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ erro: "Invalid project ID." });
  }

  return next();
}

function localizaRepositorie(request, response, next) {
  const { id } = request.params;

  const respositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if (respositorieIndex < 0) {
    return response.status(400).json({ erro: "Repositorie not found." });
  }

  request.respositorieIndex = respositorieIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.use("/repositories/:id", validateRepositoriesId);

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repositorie);

  return response.status(201).json(repositorie);
});

app.put("/repositories/:id", localizaRepositorie, (request, response) => {
  const { title, url, techs } = request.body;

  const respositorieIndex = request.respositorieIndex;

  repositories[respositorieIndex].title = title;
  repositories[respositorieIndex].url = url;
  repositories[respositorieIndex].techs = techs;

  return response.json(repositories[respositorieIndex]);
});

app.delete("/repositories/:id", localizaRepositorie, (request, response) => {

  const respositorieIndex = request.respositorieIndex;

  repositories.splice(respositorieIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", localizaRepositorie, (request, response) => {
  const respositorieIndex = request.respositorieIndex;

  repositories[respositorieIndex].likes++;

  return response.json(repositories[respositorieIndex]);
});

module.exports = app;
