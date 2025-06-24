const authJwt = require("../middleware/authjwt.js");

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const project = require("../controllers/project.controller.js");
  const permission = require("../controllers/permission.controller.js");
  const annotation = require("../controllers/annotation.controller.js");
  const projectUserPermission = require("../controllers/project_user_permission.controller.js");
  const room = require("../controllers/room.controller.js");
  const stampTemplate = require("../controllers/stamp_template.controller.js");
  const symbolFolder = require("../controllers/symbol_folder.controller.js");
  const symbol = require("../controllers/symbol.controller.js");


  let router = require("express").Router();

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/login", user.login);
  router.get("/logout", [authJwt.verifyToken], user.logout);

  // Create a new User
  router.post("/user", [authJwt.verifyToken], user.create);
  // Retrieve all Users
  router.get("/users", [authJwt.verifyToken], user.findAll);
  // Retrieve a single User with id
  router.get("/users/:id", [authJwt.verifyToken], user.get);
  // Update a User with id
  router.patch("/users/:id", [authJwt.verifyToken], user.update);
  // Delete a User with id
  router.delete("/users/:id", [authJwt.verifyToken], user.delete);
  // Delete all Users
  // router.delete("/users", user.deleteAll);

  // Project routes
  // Create a Project
  router.post("/project", [authJwt.verifyToken], project.create);
  // Retrieve all Projects
  router.get("/projects", [authJwt.verifyToken], project.findAll);
  // Retrieve a single Project with id
  router.get("/projects/:id", [authJwt.verifyToken], project.findOne);

  // Permission routes
  // Create a Permission item
  router.post("/permission", [authJwt.verifyToken], permission.create);
  // Retrieve all Permissions with name
  router.get("/permissions", [authJwt.verifyToken], permission.findAll);
  // Retrieve a single Permission with id
  router.get("/permissions/:id", [authJwt.verifyToken], permission.findOne);

  // Annotation routes
  // Create a new annotation
  router.post("/annotation", [authJwt.verifyToken], annotation.create);
  // Retrieve a single annotation with id
  router.get("/annotations/:id", [authJwt.verifyToken], annotation.get);
  // Retrieve all annotations
  router.get("/annotations", [authJwt.verifyToken], annotation.findAll);
  // Update an annotation with id
  router.patch("/annotations/:id", [authJwt.verifyToken], annotation.update);
  // Delete an annotation with id
  router.delete("/annotations/:id", [authJwt.verifyToken], annotation.delete);

  // ProjectUserPermission routes
  // Create a new permission for a user
  router.post("/projects/:projId/permission", [authJwt.verifyToken], projectUserPermission.create);
  // Retrieve all permissions of current user
  router.get("/projects/:projId/permissions", [authJwt.verifyToken], projectUserPermission.findAll);
  // Retrieve a single permission with id
  // router.get("/projects/:projId/permissions/:id", projectUserPermission.get);
  // Update an permission with id
  // router.put("/projects/:projId/permissions/:id", projectUserPermission.update);
  // Delete an permission with id
  router.delete("/projects/:projId/permissions/:id", [authJwt.verifyToken], projectUserPermission.delete);

  // Collab room
  // Create a room
  router.post("/collab/room", [authJwt.verifyToken], room.create);
  // Retrieve all rooms
  router.get('/collab/rooms', [authJwt.verifyToken], room.findAll);
  // Retrieve a single room by ID
  router.get('/collab/rooms/:id', [authJwt.verifyToken], room.findOne);
  // Update a room by ID
  router.patch('/collab/rooms/:id', [authJwt.verifyToken], room.update);
  // Delete a room by ID
  router.delete('/collab/rooms/:id', [authJwt.verifyToken], room.delete);

  // Stamp
  // Create a stamp template
  router.post("/stamp/template", [authJwt.verifyToken], stampTemplate.create);
  // Retrieve all stamp templates
  router.get('/stamp/templates', [authJwt.verifyToken], stampTemplate.findAll);
  // Retrieve a single stamp template by ID
  router.get('/stamp/templates/:id', [authJwt.verifyToken], stampTemplate.findOne);
  // Update a stamp template by ID
  router.patch('/stamp/templates/:id', [authJwt.verifyToken], stampTemplate.update);
  // Delete a stamp template by ID
  router.delete('/stamp/templates/:id', [authJwt.verifyToken], stampTemplate.delete);

  // Symbol Folder routes
  router.get("/symbol/folders", [authJwt.verifyToken], symbolFolder.findAll);
  router.post("/symbol/folders", [authJwt.verifyToken], symbolFolder.create);
  router.delete("/symbol/folders/:id", [authJwt.verifyToken], symbolFolder.delete);

  // Symbol routes
  router.post("/symbol/folders/:folderId/symbols", [authJwt.verifyToken], symbol.create);
  router.get("/symbol/folders/:folderId/symbols", [authJwt.verifyToken], symbol.findAllByFolder);
  router.get("/symbol/symbols/:id", [authJwt.verifyToken], symbol.findOne);
  router.delete("/symbol/symbols/:id", [authJwt.verifyToken], symbol.delete);


  // Catch-all route for any unmatched requests
  router.all("*", (req, res) => {
    console.log(req);
    res.status(404).send({
      message: `Route doesn't match, ${req.method} API  '${req.originalUrl}' may not be defined!`
    });
  });

  app.use("/api", router);
  console.log("JSON Web Token enabled:", authJwt.isJwtEnabled());
  console.log("Routes initialized");
};
