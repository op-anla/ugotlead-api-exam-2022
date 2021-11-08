const sql = require("./db.js");

// constructor
const EntryModel = function (entry) {
  this.campaign_id = entry.campaign_id;
  this.log_id = entry.log_id;
  this.player_id = entry.player_id;
  this.reward_id = entry.reward_id;
  this.entry_date = entry.entry_date;
};
EntryModel.getAllByCampaignId = (campaignId, result) => {
  console.log("trying to get all entries in models from cmapaign id");
  sql.query(
    "SELECT * FROM entries where campaign_id = ?",
    campaignId,
    async (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: entry.model.js ~ line 17 ~ sql.query ~ err",
          err
        );
        result(null, err);
        return;
      }
      // Here we have the correct response
      result(null, res);
    }
  );
};
EntryModel.getAllEntries = (result) => {
  console.log("trying to get all entries in models");
  sql.query("SELECT * FROM entries", async (err, res) => {
    if (err) {
      console.log("🚀 ~ file: entry.model.js ~ line 17 ~ sql.query ~ err", err);
      result(null, err);
      return;
    }
    // Here we have the correct response
    result(null, res);
    console.log("🚀 ~ file: entry.model.js ~ line 33 ~ sql.query ~ res", res);
  });
};

EntryModel.getCountEntries = (result) => {
  console.log("trying to get conut of entries in models");
  sql.query("SELECT COUNT(*) AS players FROM entries", async (err, res) => {
    if (err) {
      console.log("🚀 ~ file: entry.model.js ~ line 31 ~ sql.query ~ err", err);
      result(null, err);
      return;
    }
    // Here we have the correct response
    result(null, res);
    console.log("🚀 ~ file: entry.model.js ~ line 37 ~ sql.query ~ res", res);
  });
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

EntryModel.findTop5Campaigns = (result) => {
  console.log("trying to get top 5 campaigns based on entries");

  sql.query(
    // "SELECT campaign_id, COUNT(player_id) AS players " + //Old functioning version
    //   "FROM entries GROUP BY campaign_id " +
    //   "ORDER BY COUNT(player_id) DESC LIMIT 5",

    "SELECT entries.campaign_id, " +
      "campaigns.campaign_name, " +
      "COUNT(DISTINCT logs.log_id) AS visitors, " + //Korrekt? Er dette = visitors?
      "COUNT(DISTINCT entries.player_id) AS players " +
      "FROM entries " +
      "INNER JOIN campaigns " + //JOIN Campaigns-table to get names
      "ON entries.campaign_id=campaigns.campaign_id " +
      "INNER JOIN logs " + //JOIN logs to get visits
      "ON logs.campaign_id=campaigns.campaign_id " +
      "GROUP BY campaign_id " +
      "ORDER BY COUNT(player_id) DESC LIMIT 5",

    async (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: entry.model.js ~ line 21 ~ sql.query ~ err",
          err
        );
        result(null, err);
        return;
      }
      // Here we have the correct response
      result(null, res);
      console.log("🚀 ~ file: entry.model.js ~ line 27 ~ sql.query ~ res", res);
    }
  );
};

module.exports = EntryModel;
