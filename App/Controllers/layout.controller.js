const Layout = require("../Models/layout.model");

/* 
-----------------------------------------------
LAYOUT
-----------------------------------------------
*/
// Retrieve all campaigns from the database.
exports.findLayoutForSpecificCampaign = (req, res) => {
    console.log("find all layout for this campaign");
    Layout.findLayoutForCampaign(req.params.campaignId, (err, data)  => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the layouts for that specific campaign."
        });
      else res.send(data);
    });
  };
exports.updateLayoutForSpecificCampaign = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log("TRYING TO UPDATE LAYOUT",req.body)
  Layout.updateLayoutByCampaignId(
    req.params.campaignId,
    new Layout(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found campaign with id ${req.params.campaignId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating campaign with id " + req.params.campaignId
          });
        }
      } else res.send(data);
    }
  );
};
