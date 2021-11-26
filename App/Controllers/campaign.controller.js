const Campaign = require("../Models/campaign.model");
// Create and Save a new campaign
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("🚀 ~ file: campaign.controller.js ~ line 5 ~ req", req.body);
  // Get some dates for campaign start and enddate
  let now = new Date();
  let start_date = now.setDate(now.getDate() + 1 * 7);
  let end_date = now.setDate(now.getDate() + 4 * 7);

  // Create a Campaign
  const campaign = new Campaign({
    company_id: req.body.company_id,
    campaign_name: req.body.campaign_name,
    campaign_description: req.body.campaign_description,
    campaign_owner_id: req.body.campaign_owner_id,
    campaign_integrations: "",
    campaign_startdate: new Date(start_date),
    campaign_enddate: new Date(end_date),
  });

  // Save Campaign in the database
  Campaign.create(campaign, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the campaign.",
      });
    } else {
      res.status(201).send(data);
    }
  });
};
// Retrieve all campaigns from the database.
exports.findAll = (req, res) => {
  console.log("find all");
  Campaign.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving campaigns.",
      });
    } else {
      res.status(200).send(data);
    }
  });
};
exports.findStatsForCampaign = (req, res) => {
  Campaign.findStatsForCampaign(req.params.campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found campaignstats with id ${req.params.campaignId}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving campaignstats with id " + req.params.campaignId,
        });
      }
    } else {
      res.send(data);
    }
  });
};
// Find one specific campaign
exports.findOne = (req, res) => {
  console.log("Finder 1 kampagne");
  Campaign.findById(req.params.campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found campaign with id ${req.params.campaignId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving campaign with id " + req.params.campaignId,
        });
      }
    } else {
      console.log("Campaign.findById ~ data", data);
      res.status(200).send(data);
    }
  });
  // Removing cache
  // .then((cache) => {
  //   console.log(
  //     "🚀 ~ file: campaign.controller.js ~ line 85 ~ Campaign.findById ~ cache",
  //     cache
  //   );
  //   res.status(200).send(cache);
  // });
};
exports.flushAllCache = (res) => {
  Campaign.flushCache().then((resCode) => {
    console.log(
      "🚀 ~ file: campaign.controller.js ~ line 86 ~ Campaign.flushCache.then ~ resCode",
      resCode
    );
    return res.status(resCode).send("Flushed all campaign cache");
  });
};
// Update a campaign
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  if (req.body.campaignInfo) {
    req.body = req.body.campaignInfo;
  }
  Campaign.updateById(
    req.params.campaignId,
    new Campaign(req.body),
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
// Delete campaign
exports.delete = (req, res) => {
  Campaign.remove(req.params.campaignId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found campaign with id ${req.params.campaignId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete campaign with id " + req.params.campaignId,
        });
      }
    } else {
      res.send({
        message: `Campaign was deleted successfully!`,
      });
    }
  });
};
/* 
Mailchimp update
*/
exports.updateMailchimp = (campaignId, mailchimpInfo) => {
  console.log(
    "🚀 ~ file: campaign.controller.js ~ line 111 ~ campaignId, mailchimpInfo",
    campaignId,
    mailchimpInfo
  );
  /* 
  We need to encrypt the mailchimp info before sending it to the database
  */
  Campaign.updateMailchimpInfo(campaignId, mailchimpInfo, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};
exports.updateMailchimpList = (campaignId, mailchimpLists) => {
  console.log(
    "🚀 ~ file: campaign.controller.js ~ line 119 ~ campaignId, mailchimpLists",
    campaignId,
    mailchimpLists
  );
  Campaign.updateMailchimpLists(campaignId, mailchimpLists, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};
