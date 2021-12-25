const redisCache = require("./redisCache.controller.js");
const queueController = require("./queue.controller.js");
const checkJson = require("../common/helpers/checkmyjson");
const db = require("../Models/db");
const { campaigns } = require("../Models/db");
exports.findAll = async (req, res) => {
  const cachedResponse = await redisCache.getKey("cache_allCampaigns");
  if (cachedResponse != null || cachedResponse != undefined) {
    return res.status(200).send(JSON.parse(cachedResponse));
  }
  db.campaigns
    .findAll({ where: {} })
    .then((data) => {
      redisCache.saveKey("cache_allCampaigns", 60 * 30, JSON.stringify(data));
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving campaigns.",
      });
    });
};

exports.findOne = async (req, res) => {
  let campaignId = req.params.campaignId;
  // Check redis cache
  const cachedResponse = await redisCache.getKey(
    `cache_campaign_${campaignId}`
  );
  if (cachedResponse != null || cachedResponse != undefined) {
    let data = JSON.parse(cachedResponse);

    delete data.restrict_access_interval;
    delete data.campaign_owner_id;
    delete data.leads_goal;
    delete data.campaign_integrations;
    return res.status(200).send(data);
  }
  db.campaigns
    .findByPk(campaignId)
    .then((data) => {
      redisCache.saveKey(
        `cache_campaign_${req.params.campaignId}`,
        60 * 60 * 24,
        JSON.stringify(data)
      );
      delete data.dataValues.restrict_access_interval;
      delete data.dataValues.campaign_owner_id;
      delete data.dataValues.leads_goal;
      delete data.dataValues.campaign_integrations;
      console.log(".then ~ data", data.dataValues);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving campaigns.",
      });
    });
};
// Create and Save a new campaign
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Get some dates for campaign start and enddate
  let now = new Date();
  let start_date = now.setDate(now.getDate() + 1 * 7);
  let end_date = now.setDate(now.getDate() + 4 * 7);

  // Create a Campaign
  try {
    const newCampaign = await db.campaigns.create({
      company_id: req.body.company_id,
      campaign_name: req.body.campaign_name,
      campaign_description: req.body.campaign_description,
      campaign_owner_id: req.body.campaign_owner_id,
      campaign_integrations: "",
      campaign_startdate: new Date(start_date),
      campaign_enddate: new Date(end_date),
    });
    // Successfully created campaign, now we also delete cache
    redisCache.deleteKey("cache_allCampaigns");
    res.status(201).send(newCampaign);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.findStatsForCampaign = async (req, res) => {
  // In this endpoint we aquire additional information about the campaign
  try {
    let campaignStats = {};
    let campaignId = req.params.campaignId;
    // Get log count for campaign
    const logsCounter = await db.logs.count({ campaign_id: campaignId });
    campaignStats.logs = logsCounter;
    // Get entry count for campaign
    const entryCounter = await db.entries.count({ campaign_id: campaignId });
    campaignStats.entries = entryCounter;
    // Create ROI variable as well with logs and entries
    let roi = (campaignStats.entries * 100) / campaignStats.logs;
    campaignStats.roi = roi.toFixed(1);
    if (
      campaignStats.roi === null ||
      isNaN(campaignStats.roi) ||
      campaignStats.roi === "0.0"
    ) {
      campaignStats.roi = "0";
    }
    res.status(200).send(campaignStats);
  } catch (e) {
    console.log("exports.findStatsForCampaign= ~ e", e);
    res.status(500).send(`${e}`);
  }
};
exports.findOneFullData = async (req, res) => {
  let campaignId = req.params.campaignId;
  // Check redis cache
  const cachedResponse = await redisCache.getKey(
    `cache_campaign_${campaignId}`
  );
  if (cachedResponse != null || cachedResponse != undefined) {
    return res.status(200).send(JSON.parse(cachedResponse));
  }
  try {
    const singleCampaign = await db.campaigns.findByPk(campaignId);
    redisCache.saveKey(
      `cache_campaign_${campaignId}`,
      60 * 60 * 24,
      JSON.stringify(singleCampaign)
    );
    delete singleCampaign.restrict_access_interval;
    delete singleCampaign.campaign_owner_id;
    delete singleCampaign.leads_goal;
    delete singleCampaign.campaign_integrations;
    res.status(200).send(singleCampaign);
  } catch (err) {
    console.log("err", err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving campaigns.",
    });
  }
};
// Update a campaign
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Variables
  let campaignInfo = req.body;
  let campaignId = req.params.campaignId;
  try {
    await db.campaigns.update(campaignInfo, {
      where: { campaign_id: campaignId },
    });
    // Delete cache for this specific campaign
    redisCache.deleteKey(`cache_campaign_${campaignId}`);
    res.status(200).send("Updated campaign");
  } catch (e) {
    res.status(500).send(`${e}`);
  }
};
// Delete campaign
exports.delete = async (req, res) => {
  let campaignId = req.params.campaignId;
  try {
    await db.campaigns.destroy({
      where: { campaign_id: campaignId },
    });
    // Delete cache for this specific campaign
    redisCache.deleteKey(`cache_campaign_${campaignId}`);
    res.status(200).send(`Deleted campaign ${campaignId}`);
  } catch (e) {
    res.status(500).send(`${e}`);
  }
};
/* 
Mailchimp update
*/
exports.updateMailchimpAfterIntegration = async (campaignId, mailchimpInfo) => {
  try {
    const currentCampaign = await db.campaigns.findByPk(campaignId);
    const currentIntegrations = currentCampaign.campaign_integrations;

    // Checking if the response is an empty string ie. empty integrations
    // If it is we just let us iterate an empty array and populate it later
    let jsonCheck = checkJson.checkMyJson(currentIntegrations);
    let iterableIntegration = [];
    if (jsonCheck) {
      // If this is true we parse it because we expect an array here
      iterableIntegration = JSON.parse(currentIntegrations);
    }
    // Empty array which we will use later
    let integrations = [];
    // Iterate through every integration currently in place
    iterableIntegration.forEach((integration) => {
      let jsonCheck = checkJson.checkMyJson(integration);
      // Checking if the single integration is JSONable
      if (jsonCheck) {
        // Parse if true
        integration = JSON.parse(integration);
      }
      if (integration === "") {
        // Just return if empty string
        return;
      }
      // Push the integration to our empty array
      integrations.push(integration);
    });
    // We should now have an array with the data we need to insert
    // Push our mailchimp data to it
    integrations.push(mailchimpInfo);
    console.log("exports.findOneFullData= ~ integrations", integrations);
    // Update our campaign with the new added mailchimp integration
    await db.campaigns.update(
      {
        campaign_integrations: JSON.stringify(integrations),
      },
      { where: { campaign_id: campaignId } }
    );
  } catch (e) {
    throw e;
  }
};
/* 
Add user to all the integrations
*/
exports.addUserToIntegrations = async (req, res, next) => {
  // Submit user func
  let campaignId = req.params.campaignId;
  const submitUserToIntegrations = async (req, res, data) => {
    const integrations = JSON.parse(data.campaign_integrations);
    let promises = [];
    // Go through each integration
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
          // If we find mailchimp we add it to our mailchimp queue
          queueController.addUserToMailchimpQueue(userTask);
          break;
        case "heyLoyalty":
          userTask = {
            heyloyalty: integration["heyLoyalty"],
            userInfo: req.body.userInfo,
          };
          // If we find heyloyalty integration we add it to heyloyalty
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
  // Check redis cache for single campaign
  const cachedResponse = await redisCache.getKey(
    `cache_campaign_${campaignId}`
  );

  if (cachedResponse != null || cachedResponse != undefined) {
    let formattedResponse = JSON.parse(cachedResponse);
    // Add the user to the integration
    await submitUserToIntegrations(req, res, formattedResponse);

    return next();
  }
  // Here we get the single campaign
  try {
    const singleCampaign = await db.campaigns.findByPk(campaignId);
    redisCache.saveKey(
      `cache_campaign_${campaignId}`,
      60 * 60 * 24,
      JSON.stringify(singleCampaign)
    );
    await submitUserToIntegrations(req, res, singleCampaign);
  } catch (e) {
    // Something went wrong in this specific flow and we assume we can send 500 error
    console.log("Something went wrong", e);
    res.status(500).send(`${e}`);
  }
};
/* 
heyloyalty update
*/
exports.updateheyLoyalty = async (campaignId, heyLoyaltyInfo) => {
  // Get the campaign
  try {
    const currentCampaign = await db.campaigns.findByPk(campaignId);
    const currentIntegrations = currentCampaign.campaign_integrations;

    // Checking if the response is an empty string ie. empty integrations
    // If it is we just let us iterate an empty array and populate it later
    let jsonCheck = checkJson.checkMyJson(currentIntegrations);
    let iterableIntegration = [];
    if (jsonCheck) {
      // If this is true we parse it because we expect an array here
      iterableIntegration = JSON.parse(currentIntegrations);
    }
    // Empty array which we will use later
    let integrations = [];
    // Iterate through every integration currently in place
    iterableIntegration.forEach((integration) => {
      let jsonCheck = checkJson.checkMyJson(integration);
      // Checking if the single integration is JSONable
      if (jsonCheck) {
        // Parse if true
        integration = JSON.parse(integration);
      }
      if (integration === "") {
        // Just return if empty string
        return;
      }
      // Push the integration to our empty array
      integrations.push(integration);
    });
    // We should now have an array with the data we need to insert
    // Push our mailchimp data to it
    integrations.push(mailchimpInfo);
    console.log("exports.findOneFullData= ~ integrations", integrations);
    // Update our campaign with the new added mailchimp integration
    await db.campaigns.update(
      {
        campaign_integrations: JSON.stringify(integrations),
      },
      { where: { campaign_id: campaignId } }
    );
  } catch (e) {
    return e;
  }
  Campaign.updateIntegrationData(campaignId, heyLoyaltyInfo, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};
