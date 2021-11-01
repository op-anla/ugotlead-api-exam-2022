const sql = require("./db.js");

// constructor
const Reward = function (reward) {
  this.campaign_id = reward.campaign_id;
  this.reward_image_url = reward.reward_image_url;
  this.large_reward_image_url = reward.large_reward_image_url;
  this.reward_name = reward.reward_name;
  this.reward_description = reward.reward_description;
  this.reward_value_type = reward.reward_value_type;
  this.reward_value = reward.reward_value;
  this.reward_type = reward.reward_type;
  this.reward_claimed = reward.reward_claimed;
  this.reward_drawtime = reward.reward_drawtime;
};

Reward.getAllRewards = (result) => {
  console.log("trying to get all rewards in models");
  let reward_type = 1; //Kun faktiske præmier og ikke nitter.
  sql.query(
    "SELECT * FROM rewards WHERE reward_type = ?",
    reward_type,
    async (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: reward.model.js ~ line 21 ~ sql.query ~ err",
          err
        );
        result(null, err);
        return;
      }
      // Here we have the correct response
      result(null, res);
      console.log(
        "🚀 ~ file: reward.model.js ~ line 27 ~ sql.query ~ res",
        res
      );
    }
  );
};

Reward.findByCampaignId = (campaignId, result) => {
  sql.query(
    `SELECT * FROM rewards WHERE campaign_id = ?`,
    campaignId,
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err",
          err
        );
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found rewards: ", res.length);
        result(null, res);
        return;
      }

      // not found rewards with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
    }
  );
};
Reward.remove = (id, result) => {
  console.log("🚀 ~ file: rewards.model.js ~ line 37 ~ id", id);
  sql.query("DELETE FROM rewards WHERE reward_id = ?", id, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: rewards.model.js ~ line 49 ~ sql.query ~ err",
        err
      );

      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found reward with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
      return;
    }

    result(null, res);
  });
};
Reward.create = (newReward, result) => {
  sql.query("INSERT INTO rewards SET ?", newReward, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created reward: ", {
      id: res.insertId,
      ...newReward,
    });

    result(null, {
      id: res.insertId,
      ...newReward,
    });
  });
};

Reward.updateById = (id, reward, result) => {
  console.log("🚀 ~ file: rewards.model.js ~ line 59 ~ reward", reward);

  sql.query(
    "UPDATE rewards SET  ?  WHERE reward_id = ?",
    [reward, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: reward.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found reward with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated reward: ", {
        id: id,
        ...reward,
      });
      result(null, {
        id: id,
        ...reward,
      });
    }
  );
};
Reward.updateClaimedProp = (id, result) => {
  console.log("🚀 ~ file: rewards.model.js ~ line 59 ~ reward", id);

  sql.query(
    "UPDATE rewards SET  reward_claimed = 1  WHERE reward_id = ?",
    id,
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: reward.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found reward with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated reward: ", {
        id: id,
      });
      result(null, {
        id: id,
      });
    }
  );
};
module.exports = Reward;
