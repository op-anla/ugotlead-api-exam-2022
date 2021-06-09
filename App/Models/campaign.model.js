const sql = require("./db.js");

// constructor
const Campaign = function (campaign) {
  this.company_id = campaign.company_id;
  this.campaign_active = campaign.campaign_active;
  this.campaign_name = campaign.campaign_name;
  this.campaign_url = campaign.campaign_url;
};
Campaign.create = (newCampaign, result) => {
  sql.query("INSERT INTO campaigns SET ?", newCampaign, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created campaign: ", {
      id: res.insertId,
      ...newCampaign
    });
    result(null, {
      id: res.insertId,
      ...newCampaign
    });
  });
};
Campaign.findById = (campaignId, result) => {
  sql.query(`SELECT * FROM campaigns WHERE campaign_id = ${campaignId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found campaign: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({
      kind: "not_found"
    }, null);
  });
};
Campaign.remove = (id, result) => {
  sql.query("DELETE FROM campaigns WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({
        kind: "not_found"
      }, null);
      return;
    }

    console.log("deleted campaign with id: ", id);
    result(null, res);
  });
};
Campaign.updateById = (id, campaign, result) => {
  sql.query(
    "UPDATE campaigns SET owner_email = ?, owner_name = ? WHERE id = ?",
    [campaign.owner_email, campaign.owner_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found campaign with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated campaign: ", {
        id: id,
        ...campaign
      });
      result(null, {
        id: id,
        ...campaign
      });
    }
  );
};
Campaign.getAll = result => {
  sql.query("SELECT * FROM campaigns", async (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Campaign;
