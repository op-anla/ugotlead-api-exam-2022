const Campaign = require("../Models/campaign.model");
const Company = require("../Models/company.model");
const EntryModel = require("../Models/entry.model");
const Logging = require("../Models/logging.model");
const Reward = require("../Models/rewards.model");

exports.getAllVisitors = (req, res) => {
  console.log("We are getting all logs from DB here");
  Logging.getAllLogs((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found logs.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving logs",
        });
      }
    } else res.send(data);
  });
};

exports.getAllLeads = (req, res) => {
  console.log("We are getting all entries from DB here");
  EntryModel.getAllEntries((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};

exports.getCountPlayers = (req, res) => {
  console.log("We are getting amount of players from DB here");
  EntryModel.getCountEntries((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};

exports.getAllRewards = (req, res) => {
  console.log("We are getting all rewards from DB here");
  Reward.getAllRewards((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};

exports.getAllCampaigns = (req, res) => {
  console.log("We are getting all campaigns from DB here");
  Campaign.getAllCampaigns((err, data) => {
    //Kan ændres til .getAll så snart pagination er oprettet
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};

exports.getCountCampaigns = (req, res) => {
  console.log("We are getting count of campaigns from DB here");
  Campaign.countAll((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};

exports.getAllCompanies = (req, res) => {
  console.log("We are getting all companies from DB here");
  Company.getAll((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};

exports.getCountCompanies = (req, res) => {
  console.log("We are getting count of companies from DB here");
  Company.countAll((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving.",
        });
      }
    } else res.send(data);
  });
};
