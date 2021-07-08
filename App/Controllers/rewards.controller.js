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
// Create and Save a new reward
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log("🚀 ~ file: campaign.controller.js ~ line 5 ~ req", req.body.newReward)

  // Create a reward
  const rewardVar = new Rewards({
    campaign_id: req.body.newReward.campaign_id,
    reward_image_url: req.body.newReward.reward_image_url,
    reward_name: req.body.newReward.reward_name,
    reward_description: req.body.newReward.reward_description,
    reward_value_type: req.body.newReward.price_value_type,
    reward_value: req.body.newReward.reward_value,
    reward_type: req.body.newReward.reward_type,
  });
  console.log("🚀 ~ file: rewards.controller.js ~ line 41 ~ rewardVar", rewardVar)

  // Save reward in the database
  Rewards.create(rewardVar, (err, data) => {

    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the campaign."
      });
    else res.send(data);
  });

};
// Update reward by id
exports.updateById = (req, res) => {
  console.log("🚀 ~ file: rewards.controller.js ~ line 56 ~ req.body", req.body.reward)
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  Rewards.updateById(
    req.params.reward_id,
    new Rewards(req.body.reward),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found reward with id ${req.params.reward_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating reward with id " + req.params.reward_id
          });
        }
      } else res.send(data);
    }
  );
};
