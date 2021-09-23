const EntryModel = require("../Models/entry.model");
const Logging = require("../Models/logging.model");

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
