const sql = require("./db.js");

// constructor
const Layout = function (layout) {
  this.layout_component_content = layout.layout_component_content;
  this.layout_component_options = layout.layout_component_options;
  this.layout_component_pos_x = layout.layout_component_pos_x;
  this.layout_component_pos_y = layout.layout_component_pos_y;
  this.layout_component_size_w = layout.layout_component_size_w;
  this.layout_component_size_h = layout.layout_component_size_h;
};
Layout.remove = (campaignId, widgetId, result) => {
  console.log("🚀 ~ file: layout.model.js ~ line 13 ~ widgetId", widgetId);
  console.log("🚀 ~ file: layout.model.js ~ line 13 ~ campaignId", campaignId);
  sql.query(
    "DELETE FROM layout_comps WHERE campaign_id = ? AND layout_component_id = ?",
    [campaignId, widgetId],
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: company.model.js ~ line 51 ~ sql.query ~ err",
          err
        );
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found layout with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("deleted layout with layout_id: ", widgetId);
      result(null, res);
    }
  );
};
Layout.findLayoutForCampaign = (campaignId, result) => {
  console.log("🚀 ~ file: layout.model.js ~ line 15 ~ campaignId", campaignId);
  sql.query(
    `SELECT * FROM layout_comps WHERE campaign_id = ?`,
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
        console.log("found layouts: ", res);
        result(null, res);
        return;
      }

      // not found layout with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
    }
  );
};
Layout.updateLayoutByCampaignId = (id, layoutId, layout, result) => {
  console.log(
    "🚀 ~ file: layout.model.js ~ line 34 ~ id, campaign, result",
    id,
    layoutId,
    layout,
    result
  );
  /* 
We need both the id of layout we wanna change but also the id of the campaign the layout belongs too
*/
  sql.query(
    "UPDATE layout_comps SET    ?   WHERE campaign_id = ? AND layout_component_id = ?",
    [layout, id, layoutId],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: campaign.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found layout with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated layout: ", {
        campaignId: id,
        ...layout,
      });
      result(null, {
        campaignId: id,
        ...layout,
      });
    }
  );
};

Layout.create = (newWidget, campaignId, result) => {
  console.log(
    "🚀 ~ file: layout.model.js ~ line 96 ~ newWidget",
    newWidget,
    campaignId
  );
  sql.query(
    "INSERT INTO layout_comps SET ?, campaign_id = ?",
    [newWidget, parseInt(campaignId)],
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
          err
        );
        result(err, null);
        return;
      }

      console.log("created widget: ", {
        id: res.insertId,
        ...newWidget,
      });

      result(null, {
        id: res.insertId,
        ...newWidget,
      });
    }
  );
};
module.exports = Layout;
