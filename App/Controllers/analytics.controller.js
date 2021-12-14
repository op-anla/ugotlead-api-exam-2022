const Campaign = require("../Models/campaign.model");
const Company = require("../Models/company.model");
const EntryModel = require("../Models/entry.model");
const Logging = require("../Models/logging.model");
const Reward = require("../Models/rewards.model");

exports.getAllVisitors = (req, res) => {
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

exports.getTop5 = (req, res) => {
  EntryModel.findTop5Campaigns((err, data) => {
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
