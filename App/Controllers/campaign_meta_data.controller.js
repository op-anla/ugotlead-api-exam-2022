const CampaignMetaData = require("../Models/campaign_meta_data.model");

/* 
-----------------------------------------------
CampaignMetaData
-----------------------------------------------
*/

exports.findMetaForCampaignId = (req, res, next) => {
  console.log("FIND META DATA", req.params.campaignId);
  CampaignMetaData.findById(req.params.campaignId, (err, data) => {
    if (err) {
      return res.status(500).send();
    } else {
      return res.status(200).send(data);
    }
  });
};
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  CampaignMetaData.updateById(
    req.params.campaignId,
    new CampaignMetaData(req.body),
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
