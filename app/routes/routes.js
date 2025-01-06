module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const project = require("../controllers/project.controller.js");
  const permission = require("../controllers/permission.controller.js");
  const annotation = require("../controllers/annotation.controller.js");
  const projectUserPermission = require("../controllers/project_user_permission.controller.js");

  var router = require("express").Router();

  router.post("/login", user.login);
  router.get("/logout", user.logout);

  // Create a new User
  router.post("/user", user.create);
  // Retrieve all Users
  router.get("/users", user.findAll);
  // Retrieve a single User with id
  router.get("/users/:id", user.get);
  // Update a User with id
  router.patch("/users/:id", user.update);
  // Delete a User with id
  router.delete("/users/:id", user.delete);
  // Delete all Users
  // router.delete("/users", user.deleteAll);

  // Project routes
  // Create a Project
  router.post("/project", project.create);
  // Retrieve all Projects
  router.get("/projects", project.findAll);
  // Retrieve a single Project with id
  router.get("/projects/:id", project.findOne);

  // Permission routes
  // Create a Permission item
  router.post("/permission", permission.create);
  // Retrieve all Permissions with name
  router.get("/permissions", permission.findAll);
  // Retrieve a single Permission with id
  router.get("/permissions/:id", permission.findOne);

  // Annotation routes
  // Create a new annotation
  router.post("/annotation", annotation.create);
  // Retrieve a single annotation with id
  router.get("/annotations/:id", annotation.get);
  // Retrieve all annotations
  router.get("/annotations", annotation.findAll);
  // Update an annotation with id
  router.patch("/annotations/:id", annotation.update);
  // Delete an annotation with id
  router.delete("/annotations/:id", annotation.delete);

  // ProjectUserPermission routes
  // Create a new permission for a user
  router.post("/projects/:projId/permission", projectUserPermission.create);
  // Retrieve all permissions of current user
  router.get("/projects/:projId/permissions", projectUserPermission.findAll);
  // Retrieve a single permission with id
  // router.get("/projects/:projId/permissions/:id", projectUserPermission.get);
  // Update an permission with id
  // router.put("/projects/:projId/permissions/:id", projectUserPermission.update);
  // Delete an permission with id
  router.delete("/projects/:projId/permissions/:id", projectUserPermission.delete);

  // Catch-all route for any unmatched requests
  router.all("*", (req, res) => {
    console.log(req);
    res.status(404).send({
      message: `Route doesn't match, ${req.method} API  '${req.originalUrl}' may not be defined!`
    });
  });

  app.use("/api", router);
  console.log("Routes initialized");
};
