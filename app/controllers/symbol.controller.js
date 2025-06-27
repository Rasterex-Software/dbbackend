
const db = require("../models").db;
const Symbol = db.symbol;

const attributes = {
  exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"]
};

/**
 * @swagger
 * /api/symbol/folders/{folderId}/symbols:
 *   post:
 *     summary: Adds a symbol to a folder
 *     tags: [Symbols]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the folder to add the symbol to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the symbol
 *               type:
 *                 type: string
 *                 description: The type of the symbol (SVG or PNG)
 *               data:
 *                 type: string
 *                 description: The data of the symbol
 *     responses:
 *       201:
 *         description: The created symbol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Symbol'
 */
exports.create = async (req, res) => {
  if (!req.body.name || !req.body.type || !req.body.data) {
    res.status(400).send({
      message: "Invalid symbol data! Name, type, and data are required."
    });
    return;
  }

  const symbol = {
    name: req.body.name,
    type: req.body.type,
    data: req.body.data,
    folderId: req.params.folderId,
    createdBy: req.body.createdBy
  };

  Symbol.create(symbol)
    .then(data => {
      delete data.dataValues.createdBy;
      delete data.dataValues.updatedBy;
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the symbol."
      });
    });
};

/**
 * @swagger
 * /api/symbol/folders/{folderId}/symbols:
 *   get:
 *     summary: Retrieves all symbols in a folder
 *     tags: [Symbols]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the folder to retrieve symbols from
 *     responses:
 *       200:
 *         description: A list of symbols in the folder
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Symbol'
 */
exports.findAllByFolder = (req, res) => {
  const folderId = req.params.folderId;

  Symbol.findAll({ where: { folderId }, attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving symbols in the folder."
      });
    });
};

/**
 * @swagger
 * /api/symbol/symbols/{id}:
 *   get:
 *     summary: Retrieves a symbol by ID
 *     tags: [Symbols]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the symbol to retrieve
 *     responses:
 *       200:
 *         description: The retrieved symbol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Symbol'
 */
exports.findOne = (req, res) => {
  const id = req.params.id;

  Symbol.findByPk(id, { attributes })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find symbol with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving symbol with id=" + id
      });
    });
};

/**
 * @swagger
 * /api/symbol/symbols/{id}:
 *   delete:
 *     summary: Deletes a symbol by ID
 *     tags: [Symbols]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the symbol to delete
 *     responses:
 *       200:
 *         description: Symbol was deleted successfully
 */
exports.delete = (req, res) => {
  const id = req.params.id;

  Symbol.destroy({ where: { id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Symbol was deleted successfully."
        });
      } else {
        res.send({
          message: `Cannot delete symbol with id=${id}. Maybe symbol was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting symbol with id=" + id
      });
    });
}; 