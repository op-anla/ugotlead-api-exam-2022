const sql = require("./db.js");

// constructor
const Layout = function (layout) {
  this.id = layout.id;
  this.content = layout.content;
  this.options = layout.options;
  this.x = layout.x;
  this.y = layout.y;
  this.w = layout.w;
  this.h = layout.h;
};

Layout.findLayoutForCampaign = (campaignId, result) => {
  console.log("🚀 ~ file: layout.model.js ~ line 15 ~ campaignId", campaignId);
  sql.query(
    `SELECT * FROM layout_comps WHERE campaign_id = ${campaignId}`,
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
Layout.updateLayoutByCampaignId = (id, layout, result) => {
  console.log(
    "🚀 ~ file: layout.model.js ~ line 34 ~ id, campaign, result",
    id,
    layout,
    result
  );
  /* 
We need both the id of layout we wanna change but also the id of the campaign the layout belongs too
*/
  sql.query(
    "UPDATE layout_comps SET    layout_component_content = ?, layout_component_options = ?,   layout_component_pos_x = ?,    layout_component_pos_y = ? ,      layout_component_size_w = ? ,        layout_component_size_h = ?   WHERE campaign_id = ? AND layout_component_id = ?",
    [
      layout.content,
      layout.options,
      layout.x,
      layout.y,
      layout.w,
      layout.h,
      id,
      layout.id,
    ],
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
  console.log("🚀 ~ file: layout.model.js ~ line 96 ~ newWidget", newWidget);
  sql.query(
    "INSERT INTO layout_comps SET campaign_id = ?,layout_component_content = ?,layout_component_pos_x = ?,layout_component_pos_y = ?,layout_component_size_w = ?,layout_component_size_h = ?,layout_component_options = ?",
    [
      campaignId,
      newWidget.content,
      newWidget.x,
      newWidget.y,
      newWidget.w,
      newWidget.h,
      newWidget.options,
    ],
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
