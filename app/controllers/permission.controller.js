const db = require("../models");
const Permission = db.permission;
const Op = db.Sequelize.Op;

// Create a permission item
exports.create = (req, res) => {
  // Validate request
  if (!req.body.key) {
    res.status(400).send({
      message: "Invalid permission key!"
    });
    return;
  }

  const permission = {
    key: req.body.key
  };

  // Save user in the database
  Permission.create(permission)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the permission."
      });
    });
};

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Retrieves a list of permission items
 *     description: Returns a list of permission items filtered by key if provided.
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         description: Filter permissions by key
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Internal Server Error
 */
exports.findAll = (req, res) => {
  const key = req.query.key;
  console.log(`Permission key=${key}`);
  var condition = key ? { key: { [Op.iLike]: `%${key}%` } } : null;

  Permission.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving permissions."
      });
    });
};

// Find a single permission with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Permission.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving permission with id=" + id
      });
    });
};
