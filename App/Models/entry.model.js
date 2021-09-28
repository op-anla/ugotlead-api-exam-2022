const sql = require("./db.js");

// constructor
const EntryModel = function (entry) {
  this.campaign_id = entry.campaign_id;
  this.log_id = entry.log_id;
  this.player_id = entry.player_id;
  this.reward_id = entry.reward_id;
  this.entry_date = entry.entry_date;
  this.has_played = entry.has_played;
};
EntryModel.findEntry = (log, result) => {
  console.log("🚀 ~ file: entry.model.js ~ line 14 ~ log", log);
  sql.query(`SELECT * FROM entries WHERE log_id = ?`, log, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: entry.model.js ~ line 17 ~ sql.query ~ err", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found entry: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found entry with the id
    console.log("Didn't find any entries with logging id: ", log);
    result(
      {
        kind: "not_found",
      },
      null
    );
  });
};
EntryModel.create = (newEntry, result) => {
  console.log("🚀 ~ file: entry.model.js ~ line 14 ~ newEntry", newEntry);
  sql.query("INSERT INTO entries SET ?", newEntry, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created entry: ", {
      id: res.insertId,
      ...newEntry,
    });

    result(null, {
      id: res.insertId,
      ...newEntry,
    });
  });
};
module.exports = EntryModel;
