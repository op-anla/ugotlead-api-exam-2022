const sql = require("./db.js");
// temp remove cache
// const cluster = require("cluster");
// const myCache = require("cluster-node-cache")(cluster);

const checkJson = require("../common/helpers/checkmyjson");
// constructor
const Campaign = function (campaign) {
  this.company_id = campaign.company_id;
  this.campaign_name = campaign.campaign_name;
  this.campaign_owner_id = campaign.campaign_owner_id;
  this.campaign_startdate = campaign.campaign_startdate;
  this.campaign_enddate = campaign.campaign_enddate;
  this.campaign_description = campaign.campaign_description;
  this.restrict_access_interval = campaign.restrict_access_interval;
  this.campaign_integrations = campaign.campaign_integrations;
  this.background_image_url = campaign.background_image_url;
  this.brush_image_url = campaign.brush_image_url;
  this.primary_color = campaign.primary_color;
  this.leads_goal = campaign.leads_goal;
};
Campaign.flushCache = () => {
  console.log("FLUSHING ");
  return new Promise((resolve) => {
    myCache.flushAll();
    resolve(200);
  });
};
Campaign.create = (newCampaign, result) => {
  sql.query("INSERT INTO campaigns SET ?", newCampaign, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created campaign: ", {
      id: res.insertId,
      // Spread operator to extend the object with data
      ...newCampaign,
    });

    result(null, {
      id: res.insertId,
      ...newCampaign,
    });
  });
};
Campaign.findStatsForCampaign = (campaignId, result) => {
  /* 
  Here we find stats for a campaign. 
  */
  // Initialize a new empty object which will be filled with stats later
  const campaignStats = {};
  /* 
  Promise based logs variable which will reject or resolve whether or not it finds logs on campaign
  */
  const logs = new Promise((resolve, reject) => {
    sql.query(
      `SELECT COUNT(*) FROM logs WHERE campaign_id = ?`,
      [campaignId],
      (err, res) => {
        if (err) {
          console.log(
            "🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err",
            err
          );
          reject(err);
        }
        if (res.length) {
          console.log("found logs: ", res[0]);
          // Send the actual number of logs to resolve (then)
          resolve(res[0]["COUNT(*)"]);
        }
      }
    );
  });
  // .then - Successfull
  logs.then((res) => {
    // Set our empty object with first variable (logs)
    campaignStats.logs = res;
    console.log("STATS", campaignStats);
    // When we have the logs we now retrieve the entries for this campaign
    // Again we use promise based variables so we can resolve and reject the response
    const entries = new Promise((resolve, reject) => {
      sql.query(
        `SELECT COUNT(*) FROM entries WHERE campaign_id = ?`,
        campaignId,
        (err, res) => {
          if (err) {
            console.log(
              "🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err",
              err
            );
            reject(err);
          }
          if (res.length) {
            console.log("found ENTRIES: ", res[0]);
            // Send the actual number to stats
            resolve(res[0]["COUNT(*)"]);
          }
        }
      );
    });
    entries.then((res) => {
      // Set another variable in our campaignstats object
      campaignStats.entries = res;
      // Create ROI variable as well with logs and entries
      let roi = (campaignStats.entries * 100) / campaignStats.logs;
      console.log("🚀 ~ file: campaign.model.js ~ line 130 ~ roi", roi);
      campaignStats.roi = roi.toFixed(1);
      if (
        campaignStats.roi === null ||
        isNaN(campaignStats.roi) ||
        campaignStats.roi === "0.0"
      ) {
        campaignStats.roi = "0";
      }
      // Result in the end
      result(null, campaignStats);
      return;
    });
  });
};
const process = require("process");
Campaign.findById = (campaignId, result) => {
  console.log("Testing some process", process.pid);
  console.log("this find is executed by PID: ", process.pid);
  sql.query(
    `SELECT * FROM campaigns WHERE campaign_id = ?`,
    campaignId,
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
        console.log("found campaign: ", res[0]);
        tempCache = res[0];
        result(null, res[0]);
        return;
      }
      result(
        {
          kind: "not_found",
        },
        null
      );
    }
  );
  // Removing cache temp

  // return myCache
  //   .get(`findById_${campaignId}`)
  //   .then(function (results) {
  //     console.log("results", results);
  //     if (results.err) {
  //       console.log("ERR", results.err);
  //       return;
  //     } else {
  //       let key = `findById_${campaignId}`;
  //       console.log("problems with finding cache");
  //       if (results.value[key]) {
  //         console.log("We found a cache");
  //         return results.value[key];
  //       } else {
  //         console.log("No cache found so just normal query");
  //         return new Promise((resolve, reject) => {
  //           sql.query(
  //             `SELECT * FROM campaigns WHERE campaign_id = ?`,
  //             campaignId,
  //             (err, res) => {
  //               if (err) {
  //                 console.log(
  //                   "🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err",
  //                   err
  //                 );
  //                 return reject(err);
  //               }

  //               if (res.length) {
  //                 console.log("found campaign: ", res[0]);
  //                 myCache
  //                   .set(`findById_${campaignId}`, res[0])
  //                   .then(function (result) {
  //                     console.log("result err: ", result.err);
  //                     console.log("Result success: ", result.success);
  //                   });
  //                 return resolve(res[0]);
  //               }
  //             }
  //           );
  //         });
  //       }
  //     }
  //   })
  //   .catch((e) => {
  //     console.log("e", e);
  //   });
};
Campaign.remove = (id, result) => {
  sql.query("DELETE FROM campaigns WHERE campaign_id = ?", id, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 51 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
      return;
    }
    result(null, res);
  });
};
Campaign.updateById = (id, campaign, result) => {
  console.log("campaign in model", campaign);
  sql.query(
    "UPDATE campaigns SET  ?   WHERE campaign_id = ?",
    [campaign, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: campaign.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found campaign with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }
      console.log("updated campaign: ", {
        id: id,
        ...campaign,
      });
      result(null, {
        id: id,
        ...campaign,
      });
    }
  );
};
Campaign.updateIntegrationData = (id, integrationData, result) => {
  console.log(
    "🚀 ~ file: campaign.model.js ~ line 124 ~ id, integrationData",
    id,
    integrationData
  );
  sql.query(
    "SELECT campaign_integrations FROM campaigns WHERE campaign_id = ?",
    id,
    (err, res) => {
      if (err) {
        console.log("err", err);
        return result(null, err);
      }
      console.log("got campaign_integrations", res[0].campaign_integrations);
      /* 
      Checking if the response is an empty string ie. empty integrations
      If it is we just let us iterate an empty array and populate it later
      */
      let jsonCheck = checkJson.checkMyJson(res[0].campaign_integrations);
      let iterableIntegration = [];
      if (jsonCheck) {
        iterableIntegration = JSON.parse(res[0].campaign_integrations);
      }
      console.log("iterableIntegration", iterableIntegration);
      let integrations = [];
      iterableIntegration.forEach((integration) => {
        let jsonCheck = checkJson.checkMyJson(integration);
        if (jsonCheck) {
          integration = JSON.parse(integration);
        }

        console.log("res.forEach ~ integration", integration);
        if (integration === "") {
          return;
        }
        integrations.push(integration);
      });
      updateCampaign(integrations, id, integrationData);
    }
  );
  function updateCampaign(arrayIntegrations, campaignId, integrationData) {
    let myArray = arrayIntegrations;
    myArray.push(integrationData);
    console.log("updateCampaign ~ myArray", myArray);
    let string = JSON.stringify(myArray);
    console.log("updateCampaign ~ string", string);
    sql.query(
      "UPDATE campaigns SET campaign_integrations = ? WHERE campaign_id = ?",
      [string, campaignId],
      (err, res) => {
        if (err) {
          console.log("🚀 ~ file: campaign.model.js ~ line 74 ~ err", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found campaign with the id
          result(
            {
              kind: "not_found",
            },
            null
          );
          return;
        }
        console.log("updated campaign: ", {
          id: id,
          integrationData: integrationData,
        });
        result(null, {
          id: id,
          integrationData: integrationData,
        });
      }
    );
  }
};

Campaign.getAll = (result) => {
  sql.query("SELECT * FROM campaigns LIMIT 10", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Campaign.getAllCampaigns = (result) => {
  sql.query("SELECT * FROM campaigns", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Campaign.countAll = (result) => {
  sql.query("SELECT COUNT(*) AS campaigns FROM campaigns", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }
    result(null, res);
  });
};
module.exports = Campaign;
