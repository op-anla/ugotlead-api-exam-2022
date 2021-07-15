const sql = require("./db.js");

// constructor
const Reward = function (reward) {
  this.campaign_id = reward.campaign_id;
  this.reward_image_url = reward.reward_image_url;
  this.reward_name = reward.reward_name;
  this.reward_description = reward.reward_description;
  this.reward_value_type = reward.reward_value_type;
  this.reward_value = reward.reward_value;
  this.reward_type = reward.reward_type;
};


Reward.findByCampaignId = (campaignId, result) => {
  sql.query(`SELECT * FROM rewards WHERE campaign_id = ${campaignId}`, (err, res) => {
    console.log("🚀 ~ file: rewards.model.js ~ line 19 ~ sql.query ~ err, res", err, res)
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found rewards: ", res);
      result(null, res);
      return;
    }

    // not found rewards with the id
    result({
      kind: "not_found"
    }, null);
  });
};
Reward.create = (newReward, result) => {
  sql.query("INSERT INTO rewards SET ?", newReward, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    console.log("created reward: ", {
      id: res.insertId,
      ...newReward
    });

    result(null, {
      id: res.insertId,
      ...newReward
    });


  });



};

Reward.updateById = (id, reward, result) => {
  console.log("🚀 ~ file: rewards.model.js ~ line 59 ~ reward", reward)

  sql.query(
    "UPDATE rewards SET    reward_name = ?,    reward_description = ? ,      reward_value = ? ,        reward_value_type = ? ,          reward_image_url = ? ,            reward_type = ? ,            reward_claimed = ?  WHERE reward_id = ?",
    [
      reward.reward_name,
      reward.reward_description,
      reward.reward_value,
      reward.reward_value_type,
      reward.reward_image_url,
      reward.reward_type,
      reward.reward_claimed,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: reward.model.js ~ line 74 ~ err", err)
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found reward with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated reward: ", {
        id: id,
        ...reward
      });
      result(null, {
        id: id,
        ...reward
      });
    }
  );
};
module.exports = Reward;
