const User = require("../Models/user.model");
const crypto = require('crypto');

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
// Update a user
exports.putById = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
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
