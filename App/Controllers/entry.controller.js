const EntryModel = require("../Models/entry.model");

/* 
-----------------------------------------------
ENTRY
-----------------------------------------------
*/
exports.findEntryFromLog = (req, res) => {
  console.log("Find entry from log id", req.body);

  EntryModel.findEntry(req.body.log_id, (err, data) => {
    if (err) {
      /* 
      If the entry is not found we will return 404 with a level of entry
      This is actually the correct response if the user should be able to play.
      Since we check 2 things with this endpoint - First the log and then the entry.
      We will return the object of level with entry which on the application will be read
      as a "correct" response object that will be used to advance the user in the flow.
      */
      if (err.kind === "not_found") {
        res.status(404).send({
          message: err.kind,
          level: "entry",
          log: req.body,
        });
      }
      /* 
      If the user however is in the entry we will refuse the user from playing
      */
    } else {
      res.status(200).send(data);
    }
  });
};
exports.createEntry = (req, res, next) => {
  console.log(
    "🚀 ~ file: entry.controller.js ~ line 9 ~ REWARD",
    res.locals.redeemInfo
  );
  const datenow = Date.now();
  const now = new Date(datenow);
  const utcstring = now.toUTCString();
  console.log(
    "🚀 ~ file: entry.controller.js ~ line 14 ~ utcstring",
    utcstring
  );
  // Create an entry
  const newEntry = new EntryModel({
    campaign_id: req.body.campaign.campaign_id,
    log_id: req.body.LogId,
    player_id: req.body.PlayerId,
    reward_id: res.locals.redeemInfo.data.reward.reward_id,
    entry_date: now,
  });

  // Save entry in db
  EntryModel.create(newEntry, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the entry.",
      });
    } else {
      console.log("DATA IN LOG", data);
      res.locals.entryData = data;
      return next();
      // res.status(201).send(data);
    }
  });
};
