const RewardMeta = require("../Models/reward_meta.model");
// Create and Save a new reward
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log("🚀 ~ file: campaign.controller.js ~ line 5 ~ reqs", req.body.reward_meta)

  // Create a reward
  const newRewardMeta = new RewardMeta({
    reward_id: req.body.reward_meta.reward_id,
    reward_redeem_info: req.body.reward_meta.reward_redeem_info,
    reward_chance_info: req.body.reward_meta.reward_chance_info,
    reward_email_notification_info: req.body.reward_meta.reward_email_notification_info,
  });

  // Save reward in the database
  RewardMeta.create(newRewardMeta, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the campaign."
      });
    else {
      console.log("DATA IN REWARD META", data)
      res.status(200).send({
        data: data,
      })
    }
  })
};
