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
      if (data.length) req.body = data[0];

      return next();
    }
  });
};

//De mest forventede OS-typer, som tjekkes efter én for en
osChecker = (ua) => {
  console.log("🚀 ~ file: logging.controller.js ~ line 46 ~ ua", ua);
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
    console.log("🚀 ~ file: logging.controller.js ~ line 62 ~ osChecker", os);
    return os;
  } catch (error) {
    console.log("🚀 ~ file: logging.controller.js ~ line 62 ~ error", error);
  }
};

//De mest forventede device-typer, som tjekkes efter én for en
deviceChecker = (ua) => {
  console.log("🚀 ~ file: logging.controller.js ~ line 50 ~ ua", ua);
  let deviceType = "Ukendt";
  try {
    if (ua.includes("Windows NT")) {
      deviceType = "Windows PC";
    } else if (ua.includes("Macintosh; Intel Mac OS")) {
      deviceType = "Mac";
    } else if (ua.includes("Linux") && ua.includes("Android")) {
      //Før evt kontrol på denne.
      deviceType = "Android Tablet";
    } else if (ua.includes("Tablet") && ua.includes("Android")) {
      deviceType = "Android Tablet";
    } else if (ua.includes("Android")) {
      deviceType = "Android Mobil";
    } else if (ua.includes("MobileSafari")) {
      deviceType = "Apple iPhone";
    } else if (ua.includes("CPU iPhone OS")) {
      deviceType = "Apple iPhone";
    } else if (ua.includes("iPad")) {
      deviceType = "Apple iPad";
    }
    console.log(
      "🚀 ~ file: logging.controller.js ~ line 62 ~ deviceChecker",
      deviceType
    );
    return deviceType;
  } catch (error) {
    console.log("🚀 ~ file: logging.controller.js ~ line 90 ~ error", error);
  }
};

//De mest forventede web browsers, som tjekkes efter én for en
browserChecker = (ua) => {
  console.log("🚀 ~ file: logging.controller.js ~ line 54 ~ ua", ua);
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
    console.log(
      "🚀 ~ file: logging.controller.js ~ line 62 ~ browserChecker",
      browser
    );
    return browser;
  } catch (error) {
    console.log("🚀 ~ file: logging.controller.js ~ line 121 ~ error", error);
  }
};

exports.createLogForUser = (req, res) => {
  console.log(
    "🚀 ~ file: logging.controller.js ~ line 5 ~ reqs CREATE LOG FOR USER",
    req.headers
  );
  const _user_agent = req.headers["user-agent"];

  const _os = osChecker(_user_agent);
  const _device = deviceChecker(_user_agent);
  const _browser = browserChecker(_user_agent);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  // Create a reward
  const newLog = new Logging({
    campaign_id: parseInt(req.params.campaignId),
    operation_system: _os,
    device: _device,
    browser: _browser,
    user_agent: _user_agent,
    timestamp: today,
  });

  // Save reward in the database
  Logging.create(newLog, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the campaign.",
      });
    else {
      console.log("DATA IN LOG", data);
      res.status(201).send(data);
    }
  });
};
