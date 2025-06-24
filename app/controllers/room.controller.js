
const db = require("../models").db;
const Room = db.room;
const Op = db.Sequelize.Op;

// Specify the attributes you want to include or exclude
const attributes = {
  exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"]
}

/**
 * @swagger1
 * /api/collab/room:
 *   post:
 *     summary: Creates a new room
 *     description: Adds a new room to the database.
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the room.
 *                 example: "Test room 1"
 *               desc:
 *                 type: string
 *                 description: The description of the room.
 *                 example: ""
 *               owner:
 *                 type: integer
 *                 description: The ID of the user who owns the room.
 *                 example: 2
 *               projId:
 *                 type: integer
 *                 description: The ID of the project associated with the room.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Room created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Bad request. The room name is invalid.
 */
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Invalid room name!"
    });
    return;
  }

  const name = req.body.name;
  const existingRoom = await Room.findOne({ where: { name } });
  if (existingRoom) {
    res.status(409).send({
      message: `Conflict: A room with name '${name}' already exists.`
    });
    return;
  }

  const room = {
    name: req.body.name,
    desc: req.body.desc,
    owner: req.body.owner, // TODO: owner is creator if not passed in
    projId: req.body.projId,
  };

  // Save room in the database
  Room.create(room)
    .then(data => {
      delete data.dataValues.isClosed;
      delete data.dataValues.createdBy;
      delete data.dataValues.updatedBy;
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the room."
      });
    });
};

/**
 * @swagger1
 * /api/collab/rooms:
 *   get:
 *     summary: Retrieves a list of room items
 *     description: Returns a list of room items filtered by name if provided.
 *     tags:
 *       - Room
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter rooms by name
 *         example: ""
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Internal Server Error
 */
exports.findAll = (req, res) => {
  const name = req.query.name;
  if (name) {
    console.log(`Retrieving all rooms with name='${name}'`);
  }
  const condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Room.findAll({ where: condition, attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving rooms."
      });
    });
};

/**
 * @swagger1
 * /api/collab/rooms/{id}:
 *   get:
 *     summary: Retrieves a room by ID
 *     description: Returns a single room by its unique ID.
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the room to retrieve.
 *         example: 1
 *     responses:
 *       200:
 *         description: Room found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found.
 *       500:
 *         description: Internal server error.
 */
exports.findOne = (req, res) => {
  const id = req.params.id;

  Room.findByPk(id, { attributes })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Room with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving room with id=" + id
      });
    });
};

/**
 * @swagger1
 * /api/collab/rooms/{id}:
 *   patch:
 *     summary: Updates a room by ID
 *     description: Updates a room by its unique ID.
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the room to update.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the room.
 *                 example: "Test room 1"
 *               desc:
 *                 type: string
 *                 description: The description of the room.
 *                 example: "This is a test room"
 *               owner:
 *                 type: integer
 *                 description: The ID of the user who owns the room.
 *                 example: 2
 *               isClosed:
 *                 type: boolean
 *                 description: Whether the room is closed or not.
 *                 example: false
 *     responses:
 *       200:
 *         description: Room updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found.
 *       500:
 *         description: Internal server error.
 */
exports.update = async (req, res) => {
  const id = req.params.id;

  let existingRoom = await Room.findOne({ where: { id } });
  if (!existingRoom) {
    res.status(404).send({
      message: `Room with id '${id}' was not found.`
    });
    return;
  }
  existingRoom = existingRoom.dataValues;

  // console.log("Room before update:", existingRoom);
  // should only update fields allow to update
  const name = req.body.name;
  // If we allow duplicated room name, then we can remove this block
  if (name && name !== existingRoom.name) {
    // when user want to update room name, should check if there is existing name already
    const tempRoom = await Room.findOne({ where: { name } });
    if (tempRoom) {
      res.status(409).send({
        message: `Conflict: A room with name '${name}' already exists.`
      });
      return;
    }
    existingRoom.name = name;
  }
  if (req.body.desc != null) {
    existingRoom.desc = req.body.desc;
  }
  if (req.body.projId != null) {
    existingRoom.projId = req.body.projId;
  }
  if (req.body.isClosed != null) {
    existingRoom.isClosed = req.body.isClosed;
  }

  Room.update(existingRoom, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Room was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Room with id=${id}. Maybe room was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Room with id=" + id
      });
    });
};

/**
 * @swagger1
 * /api/collab/rooms/{id}:
 *   delete:
 *     summary: Deletes a room by ID
 *     description: Deletes a room by its unique ID.
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the room to delete.
 *         example: 1
 *     responses:
 *       200:
 *         description: Room deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room deleted successfully!"
 *       404:
 *         description: Room not found.
 *       500:
 *         description: Internal server error.
 */
exports.delete = (req, res) => {
  const id = req.params.id;

  Room.findByPk(id)
    .then(room => {
      if (!room) {
        return res.status(404).send({
          message: `Cannot find Room with id=${id}.`
        });
      }
      return room.destroy()
        .then(() => {
          res.send({ message: "Room deleted successfully!" });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting room with id=" + id
      });
    });
};
