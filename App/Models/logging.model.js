const sql = require("./db.js");

// constructor
const Logging = function (logging) {
  this.campaign_id = logging.campaign_id;
  this.operation_system = logging.operation_system;
  this.device = logging.device;
  this.browser = logging.browser;
  this.HTTP_USER_AGENT = logging.user_agent;
  this.timestamp = logging.timestamp;
  this.SESSION_ID = logging.SESSION_ID;
};
Logging.getAllLogs = (result) => {
  console.log("trying to get all logs in models");
  sql.query("SELECT * FROM logs", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: logging.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }
    // Here we have the correct response
    result(null, res);
    console.log("🚀 ~ file: logging.model.js ~ line 33 ~ sql.query ~ res", res);
  });
};

Logging.findLog = (campaignId, session_id, result) => {
  console.log("🚀 ~ file: logging.model.js ~ line 14 ~ log", session_id);
  sql.query(
    `SELECT * FROM logs WHERE (campaign_id = ? AND SESSION_ID = ?)`,
    [campaignId, session_id],
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: logging.model.js ~ line 31 ~ sql.query ~ err",
          err
        );
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found logs: ", res);
        result(null, res);
        return;
      }

      // not found log with the specific HTTP USER AGENT
      result(
        {
          kind: "not_found",
        },
        null
      );
    }
  );
};
Logging.getLogById = (log_id, result) => {
  sql.query(`SELECT * FROM logs WHERE log_id = ?`, log_id, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: logging.model.js ~ line 31 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found log: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found log with the specific HTTP USER AGENT
    result(
      {
        kind: "not_found",
      },
      null
    );
  });
};
Logging.create = (newLog, result) => {
  sql.query("INSERT INTO logs SET ?", newLog, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    result(null, {
      log_id: res.insertId,
      ...newLog,
    });
  });
};
module.exports = Logging;
