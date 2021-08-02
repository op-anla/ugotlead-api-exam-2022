const sql = require("./db.js");

// constructor
const Layout = function(layout) {
  this.layout_id = layout.id;
  this.content = layout.content;
  this.pos_x = layout.x;
  this.pos_y = layout.y;
  this.size_w = layout.w;
  this.size_h = layout.h;
};

Layout.findLayoutForCampaign = (campaignId, result) => {
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
          kind: "not_found"
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
    "UPDATE layout_comps SET    layout_component_content = ?,    layout_component_pos_x = ?,    layout_component_pos_y = ? ,      layout_component_size_w = ? ,        layout_component_size_h = ?   WHERE campaign_id = ? AND layout_component_id = ?",
    [
      layout.content,
      layout.pos_x,
      layout.pos_y,
      layout.size_w,
      layout.size_h,
      id,
      layout.layout_id
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
            kind: "not_found"
          },
          null
        );
        return;
      }

      console.log("updated layout: ", {
        campaignId: id,
        ...layout
      });
      result(null, {
        campaignId: id,
        ...layout
      });
    }
  );
};
module.exports = Layout;
