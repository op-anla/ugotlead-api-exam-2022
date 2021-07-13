const Campaign = require("../Models/campaign.model");

// Create and Save a new campaign
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log("🚀 ~ file: campaign.controller.js ~ line 5 ~ req", req.body)

  // Create a Customer
  const campaign = new Campaign({
    company_id: req.body.company_id,
    campaign_active: req.body.campaign_active,
    campaign_name: req.body.campaign_name,
    campaign_url: req.body.campaign_url,
    campaign_owner_id: req.body.campaign_owner_id,
    mailchimp_info: req.body.mailchimp_info,
    mailchimp_list: req.body.mailchimp_list,
  });

  // Save Customer in the database
  Campaign.create(campaign, (err, data) => {

    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the campaign."
      });
    else res.send(data);
  });

};

// Retrieve all campaigns from the database.
exports.findLayoutForSpecificCampaign = (req, res) => {
  console.log("find all layout for this campaign");
  Campaign.findLayoutForCampaign(req.params.campaignId, (err, data)  => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the layouts for that specific campaign."
      });
    else res.send(data);
  });
};
// Retrieve all campaigns from the database.
exports.findAll = (req, res) => {
  console.log("find all");
  Campaign.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving campaigns."
      });
    else res.send(data);
  });
};
// Find one specific campaign
exports.findOne = (req, res) => {
  Campaign.findById(req.params.campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found campaign with id ${req.params.campaignId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving campaign with id " + req.params.campaignId
        });
      }
    } else res.send(data);
  });
};
// Update a campaign
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body)
  Campaign.updateById(
    req.params.campaignId,
    new Campaign(req.body.campaignInfo),
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
// Delete template
exports.delete = (req, res) => {
  Campaign.remove(req.params.campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found campaign with id ${req.params.campaignId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete campaign with id " + req.params.campaignId
        });
      }
    } else res.send({
      message: `Campaign was deleted successfully!`
    });
  });
};

/* 
Mailchimp update
*/
exports.updateMailchimp = (campaignId, mailchimpInfo) => {
  console.log("🚀 ~ file: campaign.controller.js ~ line 111 ~ campaignId, mailchimpInfo", campaignId, mailchimpInfo)
  Campaign.updateMailchimpInfo(campaignId, mailchimpInfo, (err, data) => {
    if (err) {
      return err
    } else return data;
  })
}
exports.updateMailchimpList = (campaignId, mailchimpLists) => {
  console.log("🚀 ~ file: campaign.controller.js ~ line 119 ~ campaignId, mailchimpLists", campaignId, mailchimpLists)
  Campaign.updateMailchimpLists(campaignId, mailchimpLists, (err, data) => {
    if (err) {
      return err
    } else return data;
  })
}
