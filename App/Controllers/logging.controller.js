const Logging = require("../Models/logging.model");

/* 
-----------------------------------------------
LOGGING
-----------------------------------------------
*/
// Retrieve logs for entry
exports.getLoggingInfoByEntryData = (req, res, next) => {
  let entries = res.locals.entries;
  if (entries.length) {
    // Array with stuff
    let itemsProcessed = 0;
    function afterForeach() {
      // After foreach
      return next();
    }
    entries.forEach((entry, index, array) => {
      Logging.getLogById(entry.log_id, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving logs.",
          });
        } else {
          // Success
          itemsProcessed++;
          entries[index].logData = data;
          if (itemsProcessed === array.length) {
            afterForeach();
          }
        }
      });
    });
  } else {
    //  Empty array
    res.status(400).send();
  }
};
exports.findLogForUser = (req, res, next) => {
  Logging.findLog(req.params.campaignId, req.params.session_id, (err, data) => {
    if (err) {
      /* 
      If the user is not in the logs they will be created later.
      We will send back 404 with level of log
      */
      if (err.kind === "not_found") {
        res.status(200).send({
          message: err.kind,
          level: "log",
        });
      }
      /* 
      If the user however is in the logging we want to make sure the user has not yet made any entries
      */
    } else {
      res.locals.loggingData = data;
      // If the data is an array we just take the first one and send that
      if (data.length) {
        res.locals.loggingData = data[0];
      }

      return next();
    }
  });
};

//Operativ systemer
osChecker = (ua) => {
  let os = "Ukendt";
  try {
    if (ua.includes("Windows NT")) {
      os = "Windows";
    } else if (ua.includes("Android")) {
      os = "Android";
    } else if (ua.includes("like Mac OS X")) {
      os = "iOS";
    } else if (ua.includes("Macintosh")) {
      os = "Mac";
    } else if (ua.includes("Linux")) {
      os = "Linux";
    }
    return os;
  } catch (error) {}
};

//Devices
deviceChecker = (ua) => {
  let deviceType = "Ukendt";
  try {
    if (ua.includes("Windows")) {
      deviceType = "Windows PC";
    } else if (ua.includes("Macintosh; Intel Mac OS")) {
      deviceType = "Mac";
    } else if (ua.includes("Android") && !ua.includes("Mobile")) {
      deviceType = "Android Tablet";
    } else if (ua.includes("Android") && ua.includes("Mobile")) {
      deviceType = "Android Mobil";
    } else if (ua.includes("iPhone")) {
      deviceType = "Apple iPhone";
    } else if (ua.includes("iPad")) {
      deviceType = "Apple iPad";
    }
    return deviceType;
  } catch (error) {
    console.log("error", error);
  }
};

//Webbrowsers
browserChecker = (ua) => {
  let browser = "Ukendt";
  try {
    if (ua.includes("Firefox")) {
      browser = "Mozilla Firefox";
    } else if (ua.includes("Edg")) {
      browser = "Microsoft Edge";
    } else if (ua.includes("MSIE")) {
      browser = "Internet Explorer";
    } else if (ua.includes("OPR")) {
      browser = "Opera";
    } else if (ua.includes("Chrome/") && ua.includes("Safari/")) {
      browser = "Google Chrome";
    } else if (ua.includes("Safari/")) {
      browser = "Safari";
    } else if (ua.includes("WOW64")) {
      browser = "Internet Explorer";
    } else if (ua.includes("PostmanRuntime")) {
      browser = "Postman";
    }
    return browser;
  } catch (error) {
    console.log("🚀 ~ file: logging.controller.js ~ line 121 ~ error", error);
  }
};

exports.createLogForUser = (req, res) => {
  const _user_agent = req.headers["user-agent"];

  const _os = osChecker(_user_agent);
  const _device = deviceChecker(_user_agent);
  const _browser = browserChecker(_user_agent);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  // Create a logging
  const newLog = new Logging({
    campaign_id: parseInt(req.params.campaignId),
    operation_system: _os,
    device: _device,
    browser: _browser,
    user_agent: _user_agent,
    timestamp: today,
    SESSION_ID: req.body.session_id,
  });

  // Save log in the database
  Logging.createLog(newLog, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Some error occurred while creating the campaign.",
      });
    } else {
      // This is a non-auth endpoint which means we are careful what to send to the user
      // We only send back the log id which was created.
      let formattedId = {
        log_id: data.log_id,
      };
      res.status(201).send(formattedId);
    }
  });
};
