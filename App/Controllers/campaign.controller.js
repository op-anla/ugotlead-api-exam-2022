const Campaign = require("../Models/campaign.model");

// Create and Save a new campaign
exports.create = (req, res) => {
  console.log("create campaign: ", req.body)
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const campaign = new Campaign({
    company_id: req.body.company_id,
    campaign_active: req.body.campaign_active,
    campaign_name: req.body.campaign_name,
    campaign_url: req.body.campaign_url
  });

  // Save Customer in the database
  Campaign.create(campaign, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Customer."
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
        message: err.message || "Some error occurred while retrieving customers."
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

  Campaign.updateById(
    req.params.campaignId,
    new Template(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Template with id ${req.params.templateId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Template with id " + req.params.templateId
          });
        }
      } else res.send(data);
    }
  );
};
// Delete template
exports.delete = (req, res) => {
  Campaign.remove(req.params.templateId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Template with id ${req.params.templateId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Template with id " + req.params.templateId
        });
      }
    } else res.send({
      message: `Template was deleted successfully!`
    });
  });
};
