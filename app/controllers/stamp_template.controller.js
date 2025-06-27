const db = require("../models").db;
const StampTemplate = db.stamp_template;
const Op = db.Sequelize.Op;


const attributes = {
  exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"]
}

/**
 * @swagger
 * /api/stamp/template:
 *   post:
 *     summary: Creates a new stamp template
 *     tags: [Stamp Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the stamp template
 *                 example: "My Stamp Template"
 *               type:
 *                 type: string
 *                 description: The type of the stamp template
 *                 example: "CustomStamp"
 *               desc:
 *                 type: string
 *                 description: The description of the stamp template
 *                 example: "This is a sample stamp template"
 *               data:
 *                 type: string
 *                 description: The data of the stamp template
 *                 example: "Some template data"
 *     responses:
 *       201:
 *         description: The created stamp template
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StampTemplate'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid stamp template name or data!"
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conflict: A stamp template with name 'My Stamp Template' already exists."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred while creating the stamp template."
 *     security:
 *       - bearerAuth: []
 * components:
 *   schemas:
 *     StampTemplate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the stamp template
 *         name:
 *           type: string
 *           description: The name of the stamp template
 *         type:
 *           type: string
 *           description: The type of the stamp template
 *         desc:
 *           type: string
 *           description: The description of the stamp template
 *         data:
 *           type: string
 *           description: The data of the stamp template
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.data) {
    res.status(400).send({
      message: "Invalid stamp template name or data!"
    });
    return;
  }

  // const name = req.body.name;
  // const existingStamp = await StampTemplate.findOne({ where: { name } });
  // if (existingStamp) {
  //   res.status(409).send({
  //     message: `Conflict: A stamp template with name '${name}' already exists.`
  //   });
  //   return;
  // }

  const stampTemplate = {
    name: req.body.name,
    type: req.body.type,
    desc: req.body.desc,
    data: req.body.data,
    createdBy: req.body.createdBy, // TODO: createdBy is creator if not passed in
  };

  StampTemplate.create(stampTemplate)
    .then(data => {
      delete data.dataValues.createdBy;
      delete data.dataValues.updatedBy;
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the stamp template."
      });
    });
};

exports.findAll = (req, res) => {
  const type = req.query.type;
  // console.log(`Stamp template type=${type}`);
  const condition = type ? { type: { [Op.iLike]: `%${type}%` } } : null;

  StampTemplate.findAll({ where: condition, attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving stamp templates."
      });
    });
};

/**
 * @swagger
 * /api/stamp/templates:
 *   get:
 *     summary: Retrieves all stamp templates
 *     tags: [Stamp Templates]
 *     parameters:
 *       - in: query
 *         type: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter results by stamp template name
 *     responses:
 *       200:
 *         description: A list of stamp templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StampTemplate'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred while retrieving stamp templates."
 *     security:
 *       - bearerAuth: []
 * components:
 *   schemas:
 *     StampTemplate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the stamp template
 *         name:
 *           type: string
 *           description: The name of the stamp template
 *         type:
 *           type: string
 *           description: The type of the stamp template
 *         desc:
 *           type: string
 *           description: The description of the stamp template
 *         data:
 *           type: string
 *           description: The data of the stamp template
 *         createdBy:
 *           type: integer
 *           description: The ID of the user who created the template
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
exports.findOne = async (req, res) => {
  const id = req.params.id;

  StampTemplate.findByPk(id, { attributes })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find stamp template with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving stamp template with id=" + id
      });
    });
};

/**
 * @swagger
 * /api/stamp/templates/{id}:
 *   patch:
 *     summary: Updates a stamp template by ID
 *     tags: [Stamp Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: The ID of the stamp template to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the stamp template
 *                 example: "Stamp Template new name"
 *               type:
 *                 type: string
 *                 description: The type of the stamp template
 *                 example: "CustomStamp"
 *               desc:
 *                 type: string
 *                 description: The description of the stamp template
 *                 example: "This is an updated sample stamp template"
 *               data:
 *                 type: string
 *                 description: The data of the stamp template
 *                 example: "Some updated template data"
 *     responses:
 *       200:
 *         description: The stamp template was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stamp template was updated successfully."
 *       404:
 *         description: Stamp template not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stamp template with id '1' was not found."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conflict: A stamp template with name 'Stamp Template new name' already exists."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating stamp template with id=1"
 *     security:
 *       - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
exports.update = async (req, res) => {
  const id = req.params.id;

  let existingStamp = await StampTemplate.findOne({ where: { id } });
  if (!existingStamp) {
    res.status(404).send({
      message: `Stamp template with id '${id}' was not found.`
    });
    return;
  }
  existingStamp = existingStamp.dataValues;

  // console.log("Stamp template before update:", existingStamp);
  // should only update fields allow to update
  const name = req.body.name;
  // If we allow duplicated stamp template name, then we can remove this block
  if (name && name !== existingStamp.name) {
    // when user want to update stamp template name, should check if there is existing name already
    const tempStamp = await StampTemplate.findOne({ where: { name } });
    if (tempStamp) {
      res.status(409).send({
        message: `Conflict: A stamp template with name '${name}' already exists.`
      });
      return;
    }
    existingStamp.name = name;
  }
  if (req.body.desc != null) {
    existingStamp.desc = req.body.desc;
  }
  if (req.body.data != null) {
    existingStamp.data = req.body.data;
  }

  StampTemplate.update(existingStamp, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Stamp template was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update stamp template with id=${id}. Maybe stamp template was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating stamp template with id=" + id
      });
    });
};

/**
 * @swagger
 * /api/stamp/templates/{id}:
 *   delete:
 *     summary: Deletes a stamp template by ID
 *     tags: [Stamp Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: The ID of the stamp template to delete
 *     responses:
 *       200:
 *         description: The stamp template was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stamp template deleted successfully!"
 *       404:
 *         description: Stamp template not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot find stamp template with id=1."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting stamp template with id=1"
 *     security:
 *       - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
exports.delete = async (req, res) => {
  const id = req.params.id;

  StampTemplate.findByPk(id)
    .then(stampTemplate => {
      if (!stampTemplate) {
        return res.status(404).send({
          message: `Cannot find stamp template with id=${id}.`
        });
      }
      return stampTemplate.destroy()
        .then(() => {
          res.send({ message: "Stamp template deleted successfully!" });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting stamp template with id=" + id
      });
    });
};