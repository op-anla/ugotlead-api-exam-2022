const Rewards = require("../Models/rewards.model");

// Find the specific rewards for one campaign
exports.findRewardsByCampaignId = (req, res) => {
  Rewards.findByCampaignId(req.params.campaignId, (err, data) => {
    if (err) {
      console.log("🚀 ~ file: rewards.controller.js ~ line 7 ~ Rewards.findByCampaignId ~ err", err)

      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found rewards with id ${req.params.campaignId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving rewards with id " + req.params.campaignId
        });
      }
    } else res.send(data);
  });
};
