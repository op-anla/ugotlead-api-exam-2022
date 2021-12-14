const Campaign = require("../Models/campaign.model");
const redisCache = require("./redisCache.controller.js");
const queueController = require("./queue.controller.js");
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
      // Reset campaign cache for all campaigns
      redisCache.deleteKey("cache_allCampaigns");
      res.status(201).send(data);
    }
  });
};
// Retrieve all campaigns from the database.
exports.findAll = async (req, res) => {
  console.log("find all");
  // Before getting data from Database we need to check cache
  const cachedResponse = await redisCache.getKey("cache_allCampaigns");
  if (cachedResponse != null || cachedResponse != undefined) {
    return res.status(200).send(JSON.parse(cachedResponse));
  }
  Campaign.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving campaigns.",
      });
    } else {
      // If we ended up getting data from DB we add it to cache
      redisCache.saveKey("cache_allCampaigns", 60 * 30, JSON.stringify(data));
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
      res.status(200).send(data);
    }
  });
};
// Find one specific campaign
exports.findOne = async (req, res) => {
  // Check redis cache
  const cachedResponse = await redisCache.getKey(
    `cache_campaign_${req.params.campaignId}`
  );
  if (cachedResponse != null || cachedResponse != undefined) {
    return res.status(200).send(JSON.parse(cachedResponse));
  }
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
      // Save in Redis cache
      redisCache.saveKey(
        `cache_campaign_${req.params.campaignId}`,
        60 * 60 * 24,
        JSON.stringify(data)
      );
      res.status(200).send(data);
    }
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
        // Delete cache for this specific campaign
        redisCache.deleteKey(`cache_campaign_${req.params.campaignId}`);
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
      // Delete cache for this specific campaign
      redisCache.deleteKey(`cache_campaign_${req.params.campaignId}`);
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
  Campaign.updateIntegrationData(campaignId, mailchimpInfo, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};
/* 
Add user to all the integrations
*/
exports.addUserToIntegrations = async (req, res, next) => {
  // Submit user func
  const submitUserToIntegrations = async (req, res, data) => {
    const integrations = JSON.parse(data.campaign_integrations);
    let promises = [];
    integrations.forEach((integration) => {
      /* Getting the keys */
      let keys = Object.keys(integration);
      let userTask = {};
      switch (keys[0]) {
        case "mailchimp":
          userTask = {
            mailchimpinfo: integration["mailchimp"],
            userInfo: req.body.userInfo,
          };
          queueController.addUserToMailchimpQueue(userTask);
          break;
        case "heyLoyalty":
          userTask = {
            heyloyalty: integration["heyLoyalty"],
            userInfo: req.body.userInfo,
          };
          queueController.addUserToHeyloyaltyQueue(userTask);
          break;
        default:
          break;
      }
    });
    //
    const values = await Promise.all(promises);
    // We have added the user to all integrations
    return values;
  };
  // Check redis cache
  const cachedResponse = await redisCache.getKey(
    `cache_campaign_${req.params.campaignId}`
  );

  if (cachedResponse != null || cachedResponse != undefined) {
    let formattedResponse = JSON.parse(cachedResponse);
    const integrationResponse = await submitUserToIntegrations(
      req,
      res,
      formattedResponse
    );
    console.log("Campaign.findById ~ integrationResponse", integrationResponse);

    return next();
  }
  Campaign.findById(req.params.campaignId, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    try {
      // Save in Redis cache
      redisCache.saveKey(
        `cache_campaign_${req.params.campaignId}`,
        60 * 60 * 24,
        JSON.stringify(data)
      );
      const integrationResponse = await submitUserToIntegrations(
        req,
        res,
        formattedResponse
      );

      console.log(
        "Campaign.findById ~ integrationResponse",
        integrationResponse
      );

      return next();
    } catch (e) {
      // Something went wrong in this specific flow and we assume we can send 500 error
      console.log("Something went wrong", e);
      res.status(500).send(`${e}`);
    }
  });
};
/* 
heyloyalty update
*/
exports.updateheyLoyalty = (campaignId, heyLoyaltyInfo) => {
  console.log("campaignId, heyLoyaltyInfo", campaignId, heyLoyaltyInfo);

  Campaign.updateIntegrationData(campaignId, heyLoyaltyInfo, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};
