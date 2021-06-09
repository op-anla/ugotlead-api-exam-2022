const User = require("../Models/user.model");

// Create and Save a new user
exports.create = (req, res) => {
  console.log("create user: ", req.body)
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

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
