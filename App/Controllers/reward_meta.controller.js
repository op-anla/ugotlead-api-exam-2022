const RewardMeta = require("../Models/reward_meta.model");
// Create and Save a new reward meta
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(
    "🚀 ~ file: campaign.controller.js ~ line 5 ~ reqs",
    req.body.reward_meta
  );

  // Create a reward meta
  const newRewardMeta = new RewardMeta({
    reward_id: req.body.reward_meta.reward_id,
    reward_redeem_info: req.body.reward_meta.reward_redeem_info,
    reward_chance_info: req.body.reward_meta.reward_chance_info,
    reward_email_notification_info:
      req.body.reward_meta.reward_email_notification_info
  });

  // Save reward meta in the database
  RewardMeta.create(newRewardMeta, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the campaign."
      });
    else {
      console.log("DATA IN REWARD META", data);
      res.status(200).send({
        data: data
      });
    }
  });
};

// Update reward by id
exports.updateById = (req, res) => {
  console.log(
    "🚀 ~ file: rewards.controller.js ~ line 56 ~ req.body",
    req.body.reward_meta
  );
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(
    "Update reward meta id by id = ",
    req.body.reward_meta.reward_meta_data_id,
    req.body.reward_meta
  );
  RewardMeta.updateById(
    req.body.reward_meta.reward_meta_data_id,
    new RewardMeta(req.body.reward_meta),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found reward_meta with id ${req.body.reward_meta.reward_meta_data_id}.`
          });
        } else {
          res.status(500).send({
            message:
              "Error updating reward_meta with id " +
              req.body.reward_meta.reward_meta_data_id
          });
        }
      } else res.status(200).send("Updated reward and reward meta");
    }
  );
};
// Delete reward meta
exports.deleteById = (req, res, next) => {
  RewardMeta.remove(req.headers.reward_meta_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found reward meta with id ${req.headers.reward_meta_id}.`
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete reward meta with id " + req.headers.reward_meta_id
        });
      }
    } else next();
  });
};
// Find the specific rewards meta for one campaign
exports.findRewardMetaForReward = (req, res) => {
  console.log("GOT BODY", req.body, req.params.rewardId);
  RewardMeta.findByRewardId(req.params.rewardId, (err, data) => {
    if (err) {
      console.log(
        "🚀 ~ file: rewards.controller.js ~ line 7 ~ Rewards.findByCampaignId ~ err",
        err
      );

      if (err.kind === "not_found") {
        res.status(200).send({
          empty: true
        });
      } else {
        res.status(500).send({
          message: "Error retrieving reward_meta with id " + req.params.rewardId
        });
      }
    } else {
      res.status(200).send(data);
    }
  });
};
