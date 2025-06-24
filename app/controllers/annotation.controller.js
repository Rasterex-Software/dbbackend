const db = require("../models").db;
const Annotation = db.annotation;
const Op = db.Sequelize.Op;

// Specify the attributes you want to include or exclude
const attributes = {
  exclude: ["isDeleted", "createdAt", "updatedAt"]
}

/**
 * @swagger
 * /api/annotation:
 *   post:
 *     summary: Creates a new annotation
 *     description: Creates a new annotation with the provided data.
 *     tags:
 *       - Annotation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projId
 *               - docId
 *               - data
 *             properties:
 *               projId:
 *                 type: integer
 *                 description: The ID of the project associated with the annotation.
 *                 example: 1
 *               docId:
 *                 type: VARCHAR(255)
 *                 description: The ID of the doc associated with the annotation.
 *                 example: 'doc_id_01'
 *               data:
 *                 type: string
 *                 description: The data of the annotation.
 *                 example: '{"key": "value"}'
 *               createdBy:
 *                 type: integer
 *                 description: The ID of the user who created the annotation.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Annotation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Annotation'
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Error creating annotation.
 */
exports.create = (req, res) => {
  // if (!req.session.username) {
  //   res.status(401).send('You are not logged in');
  //   return;
  // }
  console.log(`Creating annotation with req.body=${JSON.stringify(req.body)}`);

  const projId = req.body?.projId || "";
  const docId = req.body?.docId || "";
  const roomId = req.body?.roomId || ""; // roomId is optional
  const annoData = req.body?.data || "";
  const createdBy = req.body.createdBy;
  // Validate request
  if (!projId || !docId || !annoData) {
    res.status(400).send({
      message: "Invalid projId or docId or data!"
    });
    return;
  }

  const anno = {
    projId,
    docId,
    roomId,
    data: annoData,
    createdBy,
  };

  // Save annotation in the database
  Annotation.create(anno)
    .then(data => {
      // "exclude" doesn't work for create method, manually delete some field here
      delete data.dataValues.isDeleted;
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the annotation."
      });
    });
};

/**
 * @swagger
 * /api/annotations:
 *   get:
 *     summary: Retrieves all annotations
 *     description: Retrieves a list of annotations filtered by project ID and not deleted.
 *     tags:
 *       - Annotation
 *     parameters:
 *       - in: query
 *         name: projId
 *         schema:
 *           type: integer
 *         description: Filter annotations by project ID.
 *         example: 1
 *       - in: query
 *         name: docId
 *         schema:
 *           type: VARCHAR(255)
 *         description: Filter annotations by doc ID.
 *         example: 'doc_id_01'
 *     responses:
 *       200:
 *         description: A list of annotations was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Annotation'
 *       500:
 *         description: Internal server error while retrieving annotations.
 */
exports.findAll = (req, res) => {
  const projId = req.query.projId;
  const docId = req.query.docId;
  const roomId = req.query.roomId; // roomId is optional
  const condition1 = projId ? { projId: projId } : null;
  const condition2 = docId ? { docId: docId } : null;
  const condition3 = { isDeleted: {[Op.not]: true} };
  const condition4 = roomId !== undefined ? { roomId: roomId } : null;

  Annotation.findAll({ where: { [Op.and] : [ condition1, condition2, condition3, condition4 ] }, attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving annotations."
      });
    });
};

/**
 * @swagger
 * /api/annotations/{id}:
 *   get:
 *     summary: Retrieves a single annotation by ID
 *     description: Retrieves a single annotation by its unique ID.
 *     tags:
 *       - Annotation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the annotation to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successful retrieval of the annotation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Annotation'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Annotation not found
 *       500:
 *         description: Internal server error
 */
exports.get = (req, res) => {
  const id = req.params.id?.trim();

  if (!id) {
    return res.status(400).send({
      message: "Please provide annotation id."
    });
  }
  const condition = { isDeleted: {[Op.not]: true} };

  Annotation.findByPk(id, { where: condition, attributes })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Annotation with id=${id} was not found.` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Error retrieving annotation with id=${id}` });
    });
};

/**
 * @swagger
 * /api/annotations/{id}:
 *   patch:
 *     summary: Updates an annotation by ID
 *     description: Updates an annotation, allowing modification of the `data` field only.
 *     tags:
 *       - Annotation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the annotation to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: The new data for the annotation.
 *                 example: '{"key": "new_value"}'
 *     responses:
 *       200:
 *         description: Annotation updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Annotation'
 *       400:
 *         description: Invalid ID supplied or invalid data.
 *       404:
 *         description: Annotation not found.
 *       500:
 *         description: Internal server error while updating annotation.
 */
exports.update = async (req, res) => {
  const idStr = req.params.id?.trim();
  const id = parseInt(idStr);
  if (isNaN(id)) {
    res.status(400).send({
      message: `Bad request! Expected to get a number, but get '${idStr}'`
    });
    return;
  }

  // Find annotation by id
  const existingAnno = await Annotation.findOne({ where: { id } });
  if (!existingAnno) {
    res.status(404).send({
      message: `Annotation with id '${id}' was not found.`
    });
    return;
  }

  // caller should be only able to update `data` field
  const body = {
    data: req.body.data,
  }

  Annotation.update(body, { where: { id }, attributes})
    .then(num => {
      if (num == 1) {
        Annotation.findByPk(id, attributes)
          .then(data => {
            if (data) {
              delete data.dataValues.isDeleted;
              res.send(data);
            } else {
              res.status(404).send({
                message: `Annotation with id=${id} was not found.`
              });
            }
          });
      } else {
        res.send({
          message: `Cannot update Annotation with id=${id}. Maybe annotation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Annotation with id=" + id
      });
    });
};

/**
 * @swagger
 * /api/annotations/{id}:
 *   delete:
 *     summary: Deletes an annotation by ID
 *     description: Soft deletes an annotation by setting `isDeleted` to true.
 *     tags:
 *       - Annotation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the annotation to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Annotation deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Annotation was deleted successfully!"
 *       400:
 *         description: Invalid ID supplied.
 *       404:
 *         description: Annotation not found.
 *       500:
 *         description: Internal server error while deleting annotation.
 */
exports.delete = async (req, res) => {
  const idStr = req.params.id?.trim();
  const id = parseInt(idStr);
  if (isNaN(id)) {
    res.status(400).send({
      message: `Bad request! Expected to get a number, but get '${idStr}'`
    });
    return;
  }

  // Find annotation by id
  let existingAnno = await Annotation.findOne({ where: { id } });
  if (!existingAnno) {
    res.status(404).send({
      message: `Annotation with id '${id}' was not found.`
    });
    return;
  }
  existingAnno = existingAnno.dataValues;
  if (existingAnno.isDeleted) {
    res.status(404).send({
      message: `Annotation with id '${id}' was deleted already.`
    });
    return;
  }

  // should only update `isDeleted` field
  const body = {
    isDeleted: true,
  }

  Annotation.update(body, { where: { id }, attributes})
  // Annotation.destroy({ where: { id: id }, condition})
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Annotation was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Annotation with id=${id}. Maybe annotation was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete annotation with id=" + id
      });
    });
};

// Delete all annotations from the database.
// exports.deleteAll = (req, res) => {
//   Annotation.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Users were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all users."
//       });
//     });
// };

exports.deleteAll = async (req, res) => {
  const projId = req.query.projId;
  const docId = req.query.docId;
  const roomId = req.query.roomId; // roomId is optional
  const condition1 = projId ? { projId: projId } : null;
  const condition2 = docId ? { docId: docId } : null;
  const condition3 = roomId !== undefined ? { roomId: roomId } : null;

  Annotation.destroy({
    where: { [Op.and] : [ condition1, condition2, condition3 ] },
    truncate: false
  })
    .then(nums => {
      res.send({ deleteCount: nums, message: `${nums} annotations were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        deleteCount: -1,
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};
