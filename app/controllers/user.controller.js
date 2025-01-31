const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const authJwt = require("../middleware/authjwt.js");
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Specify the attributes you want to include or exclude
const attributes = {
  exclude: ["password", "createdAt", "updatedAt"]
}

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Logs in a user
 *     description: Authenticates a user and creates session.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user, case sensitive.
 *                 example: user1
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid username and/or password!
 */
exports.login = async (req, res) => {
  const username = req.body.username || "";
  const password = req.body.password || "";
  if (!username || !password) {
    console.log(`Invalid username '${username}' and/or password '${password}'`);
    res.status(400).send({
      message: "Invalid username and/or password!"
    });
    return;
  }
  const user = await User.findOne({ where: { username, password }, attributes });

  if (!user) {
    res.status(401).send({
      accessToken: null,
      message: "Invalid credentials!"
    });
    return;
  }
  /*if (user) {
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.projId = 1; // hard code project id to 1
    res.send(user);
  } else {
    res.status(401).send({
      message: "Invalid credentials!"
    });
  }*/

  const token = jwt.sign({ userId: user.id, username: user.username },
    config.secret,
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 24 * 60 * 60 * 1000 // Expiration time (e.g., 1 day)
    });

    res.send({ user: user, accessToken: token});

};

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Logs out the current user
 *     description: Destroys the current session.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out!"
 *       500:
 *         description: Error logging out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging out!"
 */
exports.logout = (req, res) => {
  // Destroy the session
  let token = req.headers["x-access-token"];
  if (token) {
    authJwt.addToBlacklist(token);
  }
  res.send({
    message: "Logged out!"
  });

  /*req.session.destroy(err => {
    if (err) {
      return res.status(500).send({
      message: "Error logging out!"
    });
    }
    res.send({
      message: "Logged out!"
    });
  });*/
};

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Creates a new user
 *     description: Creates a new user with the provided username, password, email, and display name.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: user1
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *                 example: 123456
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
 *                 example: user@example.com
 *               displayName:
 *                 type: string
 *                 description: The display name of the user.
 *                 example: user 1
 *     responses:
 *       200:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Error creating user.
 */
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Invalid username and/or password!"
    });
    return;
  }

  const username = req.body.username;
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    res.status(409).send({
      message: `Conflict: A user with username '${username}' already exists.`
    });
    return;
  }

  // Create a User
  const user = {
    username,
    password: req.body.password,
    email: req.body.email,
    displayName: req.body.displayName,
  };

  // Save user in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."
      });
    });
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves a list of users
 *     description: Returns a list of users filtered by username if provided.
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter users by username
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */
exports.findAll = (req, res) => {
  const username = req.query.username;
  console.log(`username=${username}`);
  var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;

  User.findAll({ where: condition, attributes })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single user with an id
exports.get = (req, res) => {
  const id = req.params.id?.trim();

  if (!id) {
    return res.status(400).send({
      message: "Please provide user id."
    });
  }

  User.findByPk(id, { attributes })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `User with id=${id} was not found.` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Error retrieving user with id=${id}` });
    });
};

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Updates a user by ID
 *     description: Updates a user with the provided ID. Only specific fields can be updated.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
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
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: user1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
 *                 example: user@example.com
 *               displayName:
 *                 type: string
 *                 description: The display name of the user.
 *                 example: user 1
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was updated successfully."
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       409:
 *         description: Conflict - A user with the given username already exists.
 *       500:
 *         description: Error updating user.
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

  let existingUser = await User.findOne({ where: { id } });
  if (!existingUser) {
    res.status(404).send({
      message: `User with id '${id}' was not found.`
    });
    return;
  }
  existingUser = existingUser.dataValues;

  console.log("User before update:", existingUser);
  // should only update fields allow to update
  const username = req.body.username;
  if (username && username !== existingUser.username) {
    // when user want to update username, should check if there is existing username already
    const tempUser = await User.findOne({ where: { username } });
    if (tempUser) {
      res.status(409).send({
        message: `Conflict: A user with username '${username}' already exists.`
      });
      return;
    }
    existingUser.username = username;
  }
  existingUser.password = req.body.password || existingUser.password;
  existingUser.email = req.body.email || existingUser.email;
  existingUser.displayName = req.body.displayName || existingUser.displayName;
  console.log("User after update:", existingUser);

  User.update(existingUser, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe user was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletes a user by ID
 *     description: Deletes a user by their unique ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was deleted successfully!"
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error while deleting user.
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

  const existingUser = await User.findOne({ where: { id } });
  if (!existingUser) {
    res.status(404).send({
      message: `User with id '${id}' was not found.`
    });
    return;
  }

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe user was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete user with id=" + id
      });
    });
};

// Delete all users from the database.
// exports.deleteAll = (req, res) => {
//   User.destroy({
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
