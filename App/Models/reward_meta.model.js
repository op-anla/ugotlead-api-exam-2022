const sql = require("./db.js");

// constructor
const RewardMeta = function (rewardMeta) {
  this.reward_id = rewardMeta.reward_id;
  this.reward_redeem_info = rewardMeta.reward_redeem_info;
  this.reward_chance_info = rewardMeta.reward_chance_info;
  this.reward_email_notification_info = rewardMeta.reward_email_notification_info;
};
RewardMeta.findByRewardId = (rewardId, result) => {
  sql.query(`SELECT * FROM reward_meta_data WHERE reward_id = ${rewardId}`, (err, res) => {
    console.log("🚀 ~ file: rewards.model.js ~ line 19 ~ sql.query ~ err, res", err, res)
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found reward_meta: ", res);
      result(null, res);
      return;
    }

    // not found rewards with the id
    result({
      kind: "not_found"
    }, null);
  });
};
RewardMeta.create = (newRewardMeta, result) => {
  console.log("🚀 ~ file: reward_meta.model.js ~ line 11 ~ newRewardMeta", newRewardMeta)
  sql.query("INSERT INTO reward_meta_data SET ?", newRewardMeta, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    console.log("created reward meta: ", {
      id: res.insertId,
      ...newRewardMeta
    });

    result(null, {
      id: res.insertId,
      ...newRewardMeta
    });

  });
};

module.exports = RewardMeta;
