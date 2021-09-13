const Rewards = require("../Models/rewards.model");
exports.getAllRewardsForRedeem = (req, res, next) => {
  console.log("FIND ALL REWARDS FOR REDEEM", req.params.campaignId);
  Rewards.findByCampaignId(req.params.campaignId, (err, data) => {
    if (err) {
      console.log(
        "🚀 ~ file: rewards.controller.js ~ line 7 ~ Rewards.findByCampaignId ~ err",
        err
      );

      if (err.kind === "not_found") {
        res.status(200).send({
          empty: true,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving rewards with id " + req.params.campaignId,
        });
      }
    } else {
      console.log("GOT REWARDS FOR REDEEM - AMOUNT: ", data.length);
      req.body.rewards = data;
      return next();
    }
  });
};
// Find the specific rewards for one campaign
exports.findRewardsByCampaignId = (req, res) => {
  Rewards.findByCampaignId(req.params.campaignId, (err, data) => {
    if (err) {
      console.log(
        "🚀 ~ file: rewards.controller.js ~ line 7 ~ Rewards.findByCampaignId ~ err",
        err
      );

      if (err.kind === "not_found") {
        res.status(404).send({
          empty: true,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving rewards with id " + req.params.campaignId,
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};
// Delete reward
exports.deleteById = (req, res) => {
  console.log("ID", req.params.reward_id);
  Rewards.remove(req.params.reward_id, (err, data) => {
    if (err) {
      console.log(
        "🚀 ~ file: rewards.controller.js ~ line 55 ~ Rewards.remove ~ err",
        err
      );
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Reward with id ${req.params.reward_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Reward with id " + req.params.reward_id,
        });
      }
    } else res.status(200).send(data);
  });
};
// Create and Save a new reward
exports.create = (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("🚀 ~ file: campaign.controller.js ~ line 5 ~ reqs", req.body);

  // Create a reward
  const rewardVar = new Rewards({
    campaign_id: req.body.reward.campaign_id,
    reward_image_url: req.body.reward.reward_image_url,
    reward_name: req.body.reward.reward_name,
    reward_description: req.body.reward.reward_description,
    reward_value_type: req.body.reward.reward_value_type,
    reward_value: req.body.reward.reward_value,
    reward_type: req.body.reward.reward_type,
  });

  // Save reward in the database
  Rewards.create(rewardVar, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward.",
      });
    else {
      console.log("DATA", data);
      /* 
      We first make the reward in the database and then we create the reward meta in the database using next. 
      Next will call the next function in line in our server.js
      There we have reward_meta function to create those. 

      The thing is:
      To be able to create reward meta we need the reward id of the newly created reward. We can only get that if we change the response body
      And then send that new response body to the next function. 
      */
      req.body.reward_meta.reward_id = data.id;
      return next();
    }
  });
};
// Update reward by id
exports.updateClaim = (req, res) => {
  console.log(
    "🚀 ~ file: rewards.controller.js ~ line 56 ~ req.body",
    req.body
  );
  console.log("Let's see what we have in locals", res.locals);
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  Rewards.updateClaimedProp(req.body.reward_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found reward with id ${req.body.reward_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating reward with id " + req.body.reward_id,
        });
      }
    } else res.status(201).send(data);
  });
};
// Update reward by id
exports.updateById = (req, res, next) => {
  console.log(
    "🚀 ~ file: rewards.controller.js ~ line 56 ~ req.body",
    req.body.reward
  );
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  Rewards.updateById(
    req.params.reward_id,
    new Rewards(req.body.reward),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found reward with id ${req.params.reward_id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating reward with id " + req.params.reward_id,
          });
        }
      } else return next();
    }
  );
};
