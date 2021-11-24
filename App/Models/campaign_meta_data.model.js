const sql = require("./db.js");

// constructor
const CampaignMetaData = function (campaign_meta_data) {
  this.campaign_id = campaign_meta_data.campaign_id;
  this.campaign_terms_of_service = campaign_meta_data.campaign_terms_of_service;
  this.campaign_terms_of_service_url =
    campaign_meta_data.campaign_terms_of_service_url;
};

CampaignMetaData.findById = (campaignId, result) => {
  sql.query(
    `SELECT * FROM campaign_meta_data WHERE campaign_id = ?`,
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
};
