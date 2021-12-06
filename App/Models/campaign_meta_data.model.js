const sql = require("./db.js");

// constructor
const CampaignMetaData = function (campaign_meta_data) {
  this.campaign_id = campaign_meta_data.campaign_id;
  this.campaign_terms_of_service = campaign_meta_data.campaign_terms_of_service;
  this.campaign_terms_of_service_url =
    campaign_meta_data.campaign_terms_of_service_url;
};
CampaignMetaData.create = (newCampaignMeta, result) => {
  sql.query(
    "INSERT INTO campaign_meta_data SET ?",
    newCampaignMeta,
    (err, res) => {
      if (err) {
        console.log("sql.query ~ err", err);

        result(err, null);
        return;
      }

      console.log("created camapignMeta: ", {
        ...newCampaignMeta,
      });
      result(null, {
        ...newCampaignMeta,
      });
    }
  );
};
CampaignMetaData.findById = (campaignId, result) => {
  sql.query(
    `SELECT * FROM campaign_meta_data WHERE campaign_id = ?`,
    campaignId,
    (err, res) => {
      console.log("res", res);
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
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
};

CampaignMetaData.updateById = (id, campaignMeta, result) => {
  console.log("campaign in model", campaignMeta);
  sql.query(
    "UPDATE campaign_meta_data SET  ?   WHERE campaign_id = ?",
    [campaignMeta, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: campaignMeta.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found campaignMeta with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }
      console.log("updated campaignMeta: ", {
        ...campaignMeta,
      });
      result(null, {
        ...campaignMeta,
      });
    }
  );
};

module.exports = CampaignMetaData;
