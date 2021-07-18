const Logging = require("../Models/logging.model");

/* 
-----------------------------------------------
LOGGING
-----------------------------------------------
*/

exports.findLogForUser = (req, res) => {
  console.log("FIND USER IN LOGGING", req.headers['user-agent'])
  const user_agent = req.headers['user-agent']
  const log = {
    user_agent: user_agent,

  }
  Logging.findLog(req.params.campaignId, log, (err, data) => {
    console.log("🚀 ~ file: logging.controller.js ~ line 17 ~ Logging.findLog ~ err", err)
    if (err)
      if (err.kind === 'not_found')
        res.status(404).send({
          message: err.kind
        });
      else res.send(data);
  });
};
exports.createLogForUser = (req, res) => {

  console.log("🚀 ~ file: campaign.controller.js ~ line 5 ~ reqs CREATE LOG FOR USER", req.headers)
  const user_agent = req.headers['user-agent']
  const timeNow = Date.now();
  // Create a reward
  const newLog = new Logging({
    campaign_id: req.params.campaignId,
    operation_system: "",
    device: "",
    browser: "",
    user_agent: user_agent,
    timestamp: timeNow
  });

  // Save reward in the database
  Logging.create(newLog, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the campaign."
      });
    else {
      console.log("DATA IN LOG", data)
      res.status(200).send({
        data: data,
      })
    }
  })
};
