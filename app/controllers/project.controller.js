const db = require("../models");
const Project = db.project;
const Op = db.Sequelize.Op;

// Specify the attributes you want to include or exclude
const attributes = {
  exclude: ["createdAt", "updatedAt"]
}

// Create a project
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Invalid project name!"
    });
    return;
  }

  const project = {
    name: req.body.name
  };

  // Save user in the database
  Project.create(project)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the project."
      });
    });
};

// Find all projects with project name
exports.findAll = (req, res) => {
  const name = req.query.name;
  console.log(`Project name=${name}`);
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Project.findAll({ where: condition, attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects."
      });
    });
};

// Find a single project with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Project.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving project with id=" + id
      });
    });
};

// TODO: implement crud for projects
