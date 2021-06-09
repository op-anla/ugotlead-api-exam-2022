const User = require("../Models/user.model");
const crypto = require('crypto');
const jwtSecret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
// Create and Save a new user
exports.create = (req, res) => {
  console.log("create user: ", req.body)
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  /* 
  Here we have some validation of the user and also hashing the created user password
  */
  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto.createHmac('sha512', salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  console.log(hash);
  console.log(req.body.password)
  // Create a USER

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });


  // Save USER in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    else res.send(data);
  });

};
// Find one specific user
exports.getById = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};
// Find one specific user by token
exports.getByToken = (req, res) => {
  console.log(req.headers['authorization'])
  let token = req.headers['authorization'];
  let authorization = token.split(' ')[1],
    decoded;
  try {
    decoded = jwt.verify(authorization, jwtSecret)
  } catch (e) {
    return res.status(401).send('unauthorized')
  }
  var userId = decoded.userId;

  User.findById(userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + userId
        });
      }
    } else res.send(data);
  });
};
// Update a user
exports.putById = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  /* 
  Here we hash the new password if that is changed
  */
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
  }
  User.updateById(
    req.params.userId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.userId
          });
        }
      } else res.send(data);
    }
  );
};

// Retrieve all users from the database.
exports.getAll = (req, res) => {
  console.log("find all");
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};
// Delete user
exports.deleteUser = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.userId
        });
      }
    } else res.send({
      message: `User was deleted successfully!`
    });
  });
};
