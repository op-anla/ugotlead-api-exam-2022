const CampaignMetaData = require("../Models/campaign_meta_data.model");

/* 
-----------------------------------------------
CampaignMetaData
-----------------------------------------------
*/

exports.findMetaForCampaignId = (req, res, next) => {
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
        res.status(200).send();
      }
    }
  );
};

exports.createCampaignMetaData = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a company
  const campaignMeta = new CampaignMetaData({
    campaign_id: req.params.campaignId,
    campaign_terms_of_service: "",
    campaign_terms_of_service_url: "",
  });

  // Save CampaignMetaData in the database
  CampaignMetaData.create(campaignMeta, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the company.",
      });
    } else {
      res.status(201).send();
    }
  });
};
