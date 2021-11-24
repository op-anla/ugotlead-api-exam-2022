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
