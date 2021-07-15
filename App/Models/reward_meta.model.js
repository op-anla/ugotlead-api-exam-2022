const sql = require("./db.js");

// constructor
const RewardMeta = function (rewardMeta) {
  this.campaign_id = rewardMeta.campaign_id;
  this.reward_image_url = rewardMeta.reward_image_url;
  this.reward_name = rewardMeta.reward_name;
  this.reward_description = reward.reward_description;
  this.reward_value_type = reward.reward_value_type;
  this.reward_value = reward.reward_value;
  this.reward_type = reward.reward_type;
};

module.exports = RewardMeta;
