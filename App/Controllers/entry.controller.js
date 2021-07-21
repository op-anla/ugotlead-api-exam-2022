const EntryModel = require("../Models/entry.model");

/* 
-----------------------------------------------
ENTRY
-----------------------------------------------
*/
exports.createEntry = (req, res) => {
  console.log("🚀 ~ file: entry.controller.js ~ line 9 ~ req", req.body)
  console.log("🚀 ~ file: entry.controller.js ~ line 9 ~ REWARD", req.body.redeemInfo.data)
  const datenow = Date.now();
  const now = new Date(datenow);
  const utcstring = now.toUTCString();
  console.log("🚀 ~ file: entry.controller.js ~ line 14 ~ utcstring", utcstring)
  // Create an entry
  const newEntry = new EntryModel({
    campaign_id: req.body.campaign.campaign_id,
    log_id: req.body.LogId,
    player_id: req.body.PlayerId,
    reward_id: req.body.redeemInfo.data.reward.reward_id,
    claimed_reward: 1,
    entry_date: utcstring,
    has_played: 1
  });

  // Save entry in db
  EntryModel.create(newEntry, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the entry."
      });
    else {
      console.log("DATA IN LOG", data)
      res.status(200).send({
        message: "Added entry",
        data: data,
      })
    }
  })
};
