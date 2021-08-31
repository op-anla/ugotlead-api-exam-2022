const StandardLayoutCompModel = require("../Models/standard_layout_comp.model");
// Create and Save a new campaign
exports.createStandardLayoutComponent = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(
    "🚀 ~ file: standard_layout_comp.controller.js ~ line 6 ~ req.body",
    req.body
  );

  // Create a standard layout comp
  const newStandardLayoutComp = new StandardLayoutCompModel({
    standard_layout_id: req.params.standardLayoutId,
    standard_layout_comp_options: req.body.options,
    standard_layout_comp_content: req.body.content,
    standard_layout_comp_pos_x: req.body.x,
    standard_layout_comp_pos_y: req.body.y,
    standard_layout_comp_size_w: req.body.w,
    standard_layout_comp_size_h: req.body.h,
  });

  // Save Standard layout comp in the database
  StandardLayoutCompModel.create(newStandardLayoutComp, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the campaign.",
      });
    else res.status(201).send(data);
  });
};
// Retrieve all standard layouts comp from the database.
exports.getAllStandardLayoutComponentsFromLayoutId = (req, res) => {
  console.log(
    "find all standard layouts comp from ",
    req.params.standardLayoutId
  );
  StandardLayoutCompModel.getAllFromLayoutId(
    req.params.standardLayoutId,
    (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving standard layouts.",
        });
      else res.send(data);
    }
  );
};
/* 
Update layout comps
*/
exports.updateStandardLayoutComponent = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("req body from updateStandardLayoutComponent", req.body);
  // Create a standard layout comp
  const newStandardLayoutComp = new StandardLayoutCompModel({
    standard_layout_id: req.body.standard_layout_id,
    standard_layout_comp_options: req.body.options,
    standard_layout_comp_content: req.body.content,
    standard_layout_comp_pos_x: req.body.x,
    standard_layout_comp_pos_y: req.body.y,
    standard_layout_comp_size_w: req.body.w,
    standard_layout_comp_size_h: req.body.h,
  });

  StandardLayoutCompModel.updateById(
    newStandardLayoutComp,
    req.params.standardLayoutCompId,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found campaign with id ${req.params.standardLayoutCompId}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error updating campaign with id " +
              req.params.standardLayoutCompId,
          });
        }
      } else res.send(data);
    }
  );
};
exports.deleteStandardLayoutWidget = (req, res) => {
  StandardLayoutCompModel.remove(
    req.params.standardLayoutCompId,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found StandardLayoutCompModel with id ${req.params.standardLayoutCompId}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Could not delete StandardLayoutCompModel with id " +
              req.params.standardLayoutCompId,
          });
        }
      } else
        res.send({
          message: `StandardLayoutCompModel was deleted successfully!`,
        });
    }
  );
};
