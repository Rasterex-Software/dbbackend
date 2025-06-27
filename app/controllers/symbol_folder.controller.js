const db = require("../models").db;
const SymbolFolder = db.symbol_folder;

const attributes = {
  exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"]
};

/**
 * @swagger
 * /api/symbol/folders:
 *   get:
 *     summary: Retrieves all symbol folders
 *     tags: [Symbol Folders]
 *     responses:
 *       200:
 *         description: A list of symbol folders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SymbolFolder'
 */
exports.findAll = (req, res) => {
  SymbolFolder.findAll({ attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving symbol folders."
      });
    });
};

/**
 * @swagger
 * /api/symbol/folders:
 *   post:
 *     summary: Creates a new symbol folder
 *     tags: [Symbol Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the symbol folder
 *     responses:
 *       201:
 *         description: The created symbol folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SymbolFolder'
 */
exports.create = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Invalid symbol folder name!"
    });
    return;
  }

  const name = req.body.name;
  const existingFolder = await SymbolFolder.findOne({ where: { name } });
  if (existingFolder) {
    res.status(409).send({
      message: `Conflict: A symbol folder with name '${name}' already exists.`
    });
    return;
  }

  const symbolFolder = {
    name: req.body.name,
    createdBy: req.body.createdBy
  };

  SymbolFolder.create(symbolFolder)
    .then(data => {
      delete data.dataValues.createdBy;
      delete data.dataValues.updatedBy;
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the symbol folder."
      });
    });
};

/**
 * @swagger
 * /api/symbol/folders/{id}:
 *   delete:
 *     summary: Deletes a symbol folder by ID
 *     tags: [Symbol Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the symbol folder to delete
 *     responses:
 *       200:
 *         description: Symbol folder was deleted successfully
 */
exports.delete = (req, res) => {
  const id = req.params.id;

  SymbolFolder.destroy({ where: { id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Symbol folder was deleted successfully."
        });
      } else {
        res.send({
          message: `Cannot delete symbol folder with id=${id}. Maybe symbol folder was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting symbol folder with id=" + id
      });
    });
}; 