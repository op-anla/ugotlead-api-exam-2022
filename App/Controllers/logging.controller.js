const Logging = require("../Models/logging.model");

/* 
-----------------------------------------------
LOGGING
-----------------------------------------------
*/

exports.findLogForUser = (req, res, next) => {
  console.log("FIND USER IN LOGGING", req.headers["user-agent"]);
  const user_agent = req.headers["user-agent"];
  const log = {
    user_agent: user_agent,
  };
  Logging.findLog(req.params.campaignId, log, (err, data) => {
    console.log(
      "🚀 ~ file: logging.controller.js ~ line 17 ~ Logging.findLog ~ err",
      err,
      data
    );
    if (err) {
      /* 
      If the user is not in the logs they will be created later.
      We will send back 404 with level of log
      */
      if (err.kind === "not_found") {
        res.status(404).send({
          message: err.kind,
          level: "log",
        });
      }
      /* 
      If the user however is in the logging we want to make sure the user has not yet made any entries
      */
    } else {
      req.body = data;
      // If the data is an array we just take the first one and send that
      if (data.length) {
        req.body = data[0];
      }

      return next();
    }
  });
};
exports.createLogForUser = (req, res) => {
  console.log(
    "🚀 ~ file: campaign.controller.js ~ line 5 ~ reqs CREATE LOG FOR USER",
    req.headers
  );
  const user_agent = req.headers["user-agent"];
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  // Create a reward
  const newLog = new Logging({
    campaign_id: parseInt(req.params.campaignId),
    operation_system: "",
    device: "",
    browser: "",
    user_agent: user_agent,
    timestamp: today,
  });

  // Save reward in the database
  Logging.create(newLog, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the campaign.",
      });
    } else {
      console.log("DATA IN LOG", data);
      res.status(201).send(data);
    }
  });
};
