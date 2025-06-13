const db = require("../models");
const ProjectUserPermission = db.project_user_permission;
const Permission = db.permission;
const Op = db.Sequelize.Op;

// Specify the attributes you want to include or exclude
const attributes = {
  exclude: ["createdAt", "updatedAt", "permission"],
  // include: [
  //   [db.Sequelize.col("permission.key"), "permKey"], // convert permission.key to permKey
  // ],
}
// associate Permission table, return specified fields together
const include = {
  model: Permission,
  attributes: ["key"], // list what fields should be included
}

ProjectUserPermission.belongsTo(Permission, {
  foreignKey: "permId",
  constraints: false,
});

// Create and Save
exports.create = (req, res) => {
  console.log(`Creating ProjectUserPermission with req.body=${JSON.stringify(req.body)}`);
  const projId = req.params.projId || "";
  const userId = req.body?.userId || "";
  const permId = req.body?.permId || "";
  // Validate request
  if (!projId || !userId || !permId) {
    res.status(400).send({
      message: "Invalid projId or userId or permId!"
    });
    return;
  }

  const row = {
    projId,
    userId,
    permId
  };

  ProjectUserPermission.create(row)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ProjectUserPermission."
      });
    });
};

/**
 * @swagger
 * /api/projects/{projId}/permissions:
 *   get:
 *     summary: Retrieves a user's permissions within a project
 *     description: Retrieves a list of all project user permissions for a specific project. Supports filtering by user ID.
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: projId
 *         required: true
 *         description: ID of the project
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter permissions by user ID. If not provided, permissions for all users in the project will be returned.
 *         example: 2
 *     responses:
 *       200:
 *         description: A list of project user permissions was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectUserPermission'
 *       400:
 *         description: Invalid project ID supplied.
 *       500:
 *         description: An error occurred while retrieving project user permissions.
 */
exports.findAll = (req, res) => {
  // console.log("req.sessionStore:", req.sessionStore);
  // console.log("req.sessionID:", req.sessionID);
  // console.log("req.session:", req.session);
  const projId = req.params.projId || "";
  // A user (admin, etc.) can get another user's permission, he should put userId to req.query.
  // A user can get his own permission, in this case, we get userId from session.
  const userId = (req.query?.userId) || req.userId || "";
  const condition1 = projId ? { projId } : null;
  const condition2 = userId ? { userId } : null;

  ProjectUserPermission.findAll({ where: { [Op.and] : [ condition1, condition2 ] }, attributes, include })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProjectUserPermissions."
      });
    });
};

// Find a single result with an id
// exports.get = (req, res) => {
//   const id = req.params.id?.trim();

//   if (!id) {
//     return res.status(400).send({
//       message: "Please provide ProjectUserPermission id."
//     });
//   }

//   ProjectUserPermission.findByPk(id, { attributes })
//     .then(data => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({ message: `ProjectUserPermission with id=${id} was not found.` });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({ message: `Error retrieving ProjectUserPermission with id=${id}` });
//     });
// };

// Update a ProjectUserPermission by the id in the request
// exports.update = (req, res) => {
//   const id = req.params.id?.trim();

//   ProjectUserPermission.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "ProjectUserPermission was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update ProjectUserPermission with id=${id}. Maybe ProjectUserPermission was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating ProjectUserPermission with id=" + id
//       });
//     });
// };

// Delete a ProjectUserPermission with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  const projId = req.params.projId || "";
  const userId = req.query.userId || "";

  ProjectUserPermission.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProjectUserPermission was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete ProjectUserPermission with id=${id}. Maybe ProjectUserPermission was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete ProjectUserPermission with id=" + id
      });
    });
};

