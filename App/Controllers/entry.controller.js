const EntryModel = require("../Models/entry.model");

/* 
-----------------------------------------------
ENTRY
-----------------------------------------------
*/
exports.findEntryFromLog = (req, res) => {
  EntryModel.findEntry(res.locals.loggingData.log_id, (err, data) => {
    if (err) {
      /* 
      If the entry is not found we will return 404 with a level of entry
      This is actually the correct response if the user should be able to play.
      Since we check 2 things with this endpoint - First the log and then the entry.
      We will return the object of level with entry which on the application will be read
      as a "correct" response object that will be used to advance the user in the flow.
      */
      if (err.kind === "not_found") {
        res.status(200).send({
          message: err.kind,
          level: "entry",
          log: res.locals.loggingData,
        });
      }
      /* 
      If the user however is in the entry we will refuse the user from playing
      */
    } else {
      res.status(401).send(data);
    }
  });
};
exports.createEntry = (req, res, next) => {
  const datenow = Date.now();
  const now = new Date(datenow);
  const utcstring = now.toUTCString();
  // Create an entry
  const newEntry = new EntryModel({
    campaign_id: req.body.campaign.campaign_id,
    log_id: req.body.LogId,
    player_id: res.locals.playerData.id,
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
      res.locals.entryData = data;
      return next();
    }
  });
};
exports.findEntryCount = (req, res) => {
  let campaignId = req.params.campaignId;
  EntryModel.getAllEntryRowCount(campaignId, (err, data) => {
    if (err) {
      res
        .status(400)
        .send("Something went wrong with trying to get all entries count");
    }
    res.send(JSON.stringify(data));
  });
};
// Retrieve all entries with campaign_id from the database.
exports.findAllEntriesForCampaign = (req, res, next) => {
  console.log("Finding all entries with params", req.params);
  let payload = {
    indexStart: Number(req.params.indexStart),
    limitNum: Number(req.params.limitQuery),
    campaignId: req.params.campaignId,
  };
  EntryModel.getAllByCampaignId(payload, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving entries.",
      });
    } else {
      res.locals.entries = data;
      return next();
    }
  });
};
