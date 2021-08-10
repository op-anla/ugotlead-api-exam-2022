const Layout = require("../Models/layout.model");

/* 
-----------------------------------------------
LAYOUT
-----------------------------------------------
*/
// Retrieve all campaigns from the database.
exports.findLayoutForSpecificCampaign = (req, res) => {
  console.log("find all layout for this campaign");
  Layout.findLayoutForCampaign(req.params.campaignId, (err, data) => {
    console.log(
      "🚀 ~ file: layout.controller.js ~ line 12 ~ Layout.findLayoutForCampaign ~ err",
      err
    );
    if (err)
      if (err.kind === "not_found")
        res.status(404).send("Can't find layout for this specific campaign");
      else
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving the layouts for that specific campaign.",
        });
    else res.status(200).send(data);
  });
};
exports.updateLayoutForSpecificCampaign = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("TRYING TO UPDATE LAYOUT", req.body, req.params.campaignId);
  Layout.updateLayoutByCampaignId(
    req.params.campaignId,
    new Layout(req.body),
    (err, data) => {
      if (err) {
        console.log("🚀 ~ file: layout.controller.js ~ line 34 ~ err", err);
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found layout with id ${req.body.layout_id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating layout with id " + req.body.layout_id,
          });
        }
      } else res.send(data);
    }
  );
};
// Create new component in layout
exports.createNewComponentForCampaign = (req, res) => {
  console.log("🚀 ~ file: entry.controller.js ~ line 9 ~ req", req.body);
  const newWidget = new Layout({
    content: req.body.content,
    options: JSON.stringify(req.body.options),
    x: req.body.x,
    y: req.body.y,
    h: req.body.h,
    w: req.body.w,
  });

  // Save layout widget in db
  Layout.create(newWidget, req.params.campaignId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the widget.",
      });
    else {
      console.log("DATA IN LOG", data);
      res.status(200).send({
        message: "Added widget",
        data: data,
      });
    }
  });
};
