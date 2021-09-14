const sql = require("./db.js");

// constructor
const RewardMeta = function (rewardMeta) {
  this.reward_id = rewardMeta.reward_id;
  this.reward_redeem_info = rewardMeta.reward_redeem_info;
  this.reward_email_notification_info =
    rewardMeta.reward_email_notification_info;
};
RewardMeta.updateById = (id, rewardMeta, result) => {
  console.log("🚀 ~ file: reward_meta.model.js ~ line 11 ~ id", id);
  console.log("🚀 ~ file: rewards.model.js ~ line 59 ~ reward", rewardMeta);

  sql.query(
    "UPDATE reward_meta_data SET  ? WHERE reward_meta_data_id = ?",
    [rewardMeta, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: reward.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found reward meta with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated reward meta: ", {
        id: id,
        ...rewardMeta,
      });
      result(null, {
        id: id,
        ...rewardMeta,
      });
    }
  );
};
RewardMeta.remove = (id, result) => {
  sql.query(
    "DELETE FROM reward_meta_data WHERE reward_meta_data_id = ?",
    id,
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: campaign.model.js ~ line 51 ~ sql.query ~ err",
          err
        );
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("deleted reward_meta with reward_meta_data_id: ", id);
      result(null, res);
    }
  );
};
RewardMeta.findByRewardId = (rewardId, result) => {
  sql.query(
    `SELECT * FROM reward_meta_data WHERE reward_id = ?`,
    rewardId,
    (err, res) => {
      console.log(
        "🚀 ~ file: rewards.model.js ~ line 19 ~ sql.query ~ err, res",
        err,
        res
      );
      if (err) {
        console.log(
          "🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err",
          err
        );
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found reward_meta: ", res);
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
RewardMeta.create = (newRewardMeta, result) => {
  console.log(
    "🚀 ~ file: reward_meta.model.js ~ line 11 ~ newRewardMeta",
    newRewardMeta
  );
  sql.query("INSERT INTO reward_meta_data SET ?", newRewardMeta, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created reward meta: ", {
      id: res.insertId,
      ...newRewardMeta,
    });

    result(null, {
      id: res.insertId,
      ...newRewardMeta,
    });
  });
};

module.exports = RewardMeta;
