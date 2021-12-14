const StandardLayoutModel = require("../Models/standard_layout.model");

/* 
-----------------------------------------------
STANDARD LAYOUT
-----------------------------------------------
*/

exports.updateStandardLayoutInfo = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
};
// Retrieve all standard layouts from the database.
exports.getAllStandardLayouts = (req, res) => {
  StandardLayoutModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving standard layouts.",
      });
    } else {
      res.send(data);
    }
  });
};
// Update a standard layout
exports.updateStandardLayout = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  if (req.body.campaignInfo) {
    req.body = req.body.campaignInfo;
  }
  StandardLayoutModel.updateById(
    req.params.campaignId,
    new StandardLayoutModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found campaign with id ${req.params.campaignId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating campaign with id " + req.params.campaignId,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};
// Create new component in layout
exports.createStandardLayout = (req, res) => {
  const standardLayout = new StandardLayoutModel(req.body.standardLayout);
  // Save standard layout in DB
  StandardLayoutModel.create(standardLayout, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the standard layout.",
      });
    } else {
      res.status(201).send({
        message: "Added standard layout",
        data: data,
      });
    }
  });
};
