const sql = require("./db.js");

// constructor
const Logging = function (logging) {
  this.campaign_id = logging.campaign_id;
  this.operation_system = logging.operation_system;
  this.device = logging.device;
  this.browser = logging.browser;
  this.HTTP_USER_AGENT = logging.user_agent;
  this.timestamp = logging.timestamp;
};

Logging.findLog = (campaignId, log, result) => {
  console.log("🚀 ~ file: logging.model.js ~ line 14 ~ log", log);
  sql.query(
    `SELECT * FROM logs WHERE (campaign_id = ${campaignId} AND HTTP_USER_AGENT = '${log.user_agent}')`,
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

    console.log("created log: ", {
      id: res.insertId,
      ...newLog,
    });

    result(null, {
      id: res.insertId,
      ...newLog,
    });
  });
};
module.exports = Logging;
