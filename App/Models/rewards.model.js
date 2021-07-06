const sql = require("./db.js");

// constructor
const Reward = function (reward) {
  this.company_id = campaign.company_id;
  this.campaign_active = campaign.campaign_active;
  this.campaign_name = campaign.campaign_name;
  this.campaign_url = campaign.campaign_url;
  this.campaign_owner_id = campaign.campaign_owner_id;
  this.mailchimp_info = campaign.mailchimp_info;
  this.mailchimp_list = campaign.mailchimp_list;
  this.campaign_startdate = campaign.campaign_startdate;
  this.campaign_enddate = campaign.campaign_enddate;
};


Reward.findByCampaignId = (campaignId, result) => {
  sql.query(`SELECT * FROM rewards WHERE campaign_id = ${campaignId}`, (err, res) => {
    console.log("🚀 ~ file: rewards.model.js ~ line 19 ~ sql.query ~ err, res", err, res)
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 31 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found rewards: ", res);
      result(null, res[0]);
      return;
    }

    // not found rewards with the id
    result({
      kind: "not_found"
    }, null);
  });
};
module.exports = Reward;
