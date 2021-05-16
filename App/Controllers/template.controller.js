const Template = require("../Models/template.model");

// Create and Save a new Template
exports.create = (req, res) => {
  console.log("create template: ", req.body)
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const template = new Template({
    owner_email: req.body.owner_email,
    owner_name: req.body.owner_name
  });

  // Save Customer in the database
  Template.create(template, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });

};

// Retrieve all Templates from the database.
exports.findAll = (req, res) => {
  console.log("find all");
  Template.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};
// Find one specific Template
exports.findOne = (req, res) => {
  Template.findById(req.params.templateId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Template with id ${req.params.templateId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Template with id " + req.params.templateId
        });
      }
    } else res.send(data);
  });
};
// Update a template
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Template.updateById(
    req.params.templateId,
    new Template(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Template with id ${req.params.templateId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Template with id " + req.params.templateId
          });
        }
      } else res.send(data);
    }
  );
};
// Delete template
exports.delete = (req, res) => {
  Template.remove(req.params.templateId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Template with id ${req.params.templateId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Template with id " + req.params.templateId
        });
      }
    } else res.send({
      message: `Template was deleted successfully!`
    });
  });
};
