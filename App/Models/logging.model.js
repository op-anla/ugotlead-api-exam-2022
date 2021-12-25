module.exports = (sequelize, Sequelize) => {
  const logs = sequelize.define(
    "logs",
    {
      log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      },
      campaign_id: {
        type: Sequelize.INTEGER,
      },
      operation_system: {
        type: Sequelize.STRING(255),
      },
      device: {
        type: Sequelize.STRING(255),
      },
      browser: {
        type: Sequelize.STRING(255),
      },
      IP_ADDRESS: {
        type: Sequelize.STRING(255),
      },
      HTTP_USER_AGENT: {
        type: Sequelize.STRING(255),
      },
      timestamp: {
        type: Sequelize.DATE,
      },
      SESSION_ID: {
        type: Sequelize.STRING(45),
      },
    },
    { tableName: "logs", timestamps: false }
  );

  return logs;
};
// // constructor
// const Logging = function (logging) {
//   this.campaign_id = logging.campaign_id;
//   this.operation_system = logging.operation_system;
//   this.device = logging.device;
//   this.browser = logging.browser;
//   this.HTTP_USER_AGENT = logging.user_agent;
//   this.timestamp = logging.timestamp;
//   this.SESSION_ID = logging.SESSION_ID;
// };
// Logging.getAllLogs = (result) => {
//   console.log("trying to get all logs in models");
//   sql.query("SELECT * FROM logs", async (err, res) => {
//     if (err) {
//       console.log(
//         "🚀 ~ file: logging.model.js ~ line 101 ~ sql.query ~ err",
//         err
//       );
//       result(err, null);
//       return;
//     }
//     // Here we have the correct response
//     result(null, res);
//     console.log("🚀 ~ file: logging.model.js ~ line 33 ~ sql.query ~ res", res);
//   });
// };

// Logging.findLog = (campaignId, session_id, result) => {
//   console.log("🚀 ~ file: logging.model.js ~ line 14 ~ log", session_id);
//   sql.query(
//     `SELECT * FROM logs WHERE (campaign_id = ? AND SESSION_ID = ?)`,
//     [campaignId, session_id],
//     (err, res) => {
//       if (err) {
//         console.log(
//           "🚀 ~ file: logging.model.js ~ line 31 ~ sql.query ~ err",
//           err
//         );
//         result(err, null);
//         return;
//       }

//       if (res.length) {
//         result(null, res);
//         return;
//       }

//       // not found log with the specific HTTP USER AGENT
//       result(
//         {
//           kind: "not_found",
//         },
//         null
//       );
//     }
//   );
// };
// Logging.getLogById = (log_id, result) => {
//   sql.query(`SELECT * FROM logs WHERE log_id = ?`, log_id, (err, res) => {
//     if (err) {
//       console.log(
//         "🚀 ~ file: logging.model.js ~ line 31 ~ sql.query ~ err",
//         err
//       );
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found log: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found log with the specific HTTP USER AGENT
//     result(
//       {
//         kind: "not_found",
//       },
//       null
//     );
//   });
// };
// Logging.createLog = (newLog, result) => {
//   sql.query("INSERT INTO logs SET ?", newLog, (err, res) => {
//     if (err) {
//       console.log(
//         "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
//         err
//       );
//       result(err, null);
//       return;
//     }

//     result(null, {
//       log_id: res.insertId,
//       ...newLog,
//     });
//   });
// };
// module.exports = Logging;
