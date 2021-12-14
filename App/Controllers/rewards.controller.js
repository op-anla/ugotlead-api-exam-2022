const Rewards = require("../Models/rewards.model");
const email = require("./email.controller.js");

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
      res.locals.rewards = data;
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
// Find the specific reward by entryData
exports.getRewardInfoByEntryData = (req, res) => {
  console.log("DO WE HAVE ENTRIES?", res.locals.entries[0]);
  let entries = res.locals.entries;
  if (entries.length) {
    // Array with stuff
    let itemsProcessed = 0;
    function afterForeach() {
      // After foreach
      console.log("After foreach", entries[0]);
      res.status(200).send(entries);
    }
    entries.forEach((entry, index, array) => {
      Rewards.getSingleRewardById(entry.reward_id, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving campaigns.",
          });
        } else {
          // Success
          itemsProcessed++;
          let formatRewardData = {
            reward_type: data.reward_type,
            reward_value: data.reward_value,
            reward_image_url: data.reward_image_url,
            reward_name: data.reward_name,
          };
          entries[index].rewardData = formatRewardData;
          if (itemsProcessed === array.length) {
            afterForeach();
          }
        }
      });
    });
  } else {
    //  Empty array
    res.status(400).send();
  }
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
    } else {
      res.status(200).send(data);
    }
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
    large_reward_image_url: req.body.reward.large_reward_image_url,
    reward_name: req.body.reward.reward_name,
    reward_description: req.body.reward.reward_description,
    reward_value_type: req.body.reward.reward_value_type,
    reward_value: req.body.reward.reward_value,
    reward_type: req.body.reward.reward_type,
    reward_claimed: req.body.reward.reward_claimed,
    reward_drawtime: req.body.reward.reward_drawtime,
  });

  // Save reward in the database
  Rewards.create(rewardVar, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward.",
      });
    } else {
      console.log("DATA", data);
      /* 
      We first make the reward in the database and then we create the reward meta in the database using next. 
      Next will call the next function in line in our server.js
      There we have reward_meta function to create those. 

      To be able to create reward meta we need the reward id of the newly created reward. We can only get that
      if we change the res.locals object 
      */
      res.locals.reward_meta = {
        ...req.body.reward.reward_meta,
        reward_id: data.id,
      };

      return next();
    }
  });
};
// Update reward by id
exports.updateClaim = (req, res) => {
  /* 
  If the user hasn't won anything we wont update the claim prop!
  IMPORTANT
  */
  if (res.locals.redeemInfo.won === false) {
    //  User did not win
    res.locals.redeemInfo = {
      won: res.locals.redeemInfo.won,
      data: {
        reward: res.locals.redeemInfo.data.reward,
      },
    };
    email.sendEmailToOperators(req, res);
    return res.status(200).send(res.locals.redeemInfo);
  }
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  Rewards.updateClaimedProp(
    res.locals.redeemInfo.data.reward.reward_id,
    (err) => {
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
      } else {
        res.locals.redeemInfo = {
          won: res.locals.redeemInfo.won,
          data: {
            reward: res.locals.redeemInfo.data.reward,
          },
        };

        email.sendEmailToOperators(req, res);
        return res.status(200).send(res.locals.redeemInfo);
      }
    }
  );
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
    (err) => {
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
      } else {
        return next();
      }
    }
  );
};
