const sql = require("./db.js");

// constructor
const Campaign = function (campaign) {
  this.company_id = campaign.company_id;
  this.campaign_active = campaign.campaign_active;
  this.campaign_name = campaign.campaign_name;
  this.campaign_url = campaign.campaign_url;
};
Campaign.create = (newCampaign, result) => {
  sql.query("INSERT INTO templates SET ?", newCampaign, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created template: ", {
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
  sql.query(`SELECT * FROM campaign WHERE id = ${campaignId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found template: ", res[0]);
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
  sql.query("DELETE FROM templates WHERE id = ?", id, (err, res) => {
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

    console.log("deleted template with id: ", id);
    result(null, res);
  });
};
Campaign.updateById = (id, template, result) => {
  sql.query(
    "UPDATE templates SET owner_email = ?, owner_name = ? WHERE id = ?",
    [template.owner_email, template.owner_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found template with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated template: ", {
        id: id,
        ...template
      });
      result(null, {
        id: id,
        ...template
      });
    }
  );
};
Campaign.getAll = result => {
  sql.query("SELECT * FROM templates", async (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("templates: ", res);
    result(null, res);
  });
};

module.exports = Template;
