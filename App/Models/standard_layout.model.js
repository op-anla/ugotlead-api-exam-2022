const sql = require("./db.js");

// constructor
const StandardLayoutModel = function (standard_layout) {
  this.standard_layout_name = standard_layout.standard_layout_name;
  this.standard_layout_options = standard_layout.standard_layout_options;
};

StandardLayoutModel.updateLayoutByCampaignId = (
  id,
  layoutId,
  layout,
  result
) => {
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
StandardLayoutModel.getAll = (result) => {
  sql.query("SELECT * FROM standard_layouts LIMIT 10", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }
    result(null, res);
  });
};
StandardLayoutModel.create = (newStandardLayout, result) => {
  console.log(
    "🚀 ~ file: standard_layout.model.js ~ line 59 ~ newStandardLayout",
    newStandardLayout
  );

  sql.query(
    "INSERT INTO standard_layouts SET  ?",
    newStandardLayout,
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: standard_layout.model.js ~ line 68 ~ err", err);

        result(err, null);
        return;
      }

      console.log("created standard layout: ", {
        id: res.insertId,
        ...newStandardLayout,
      });

      result(null, {
        id: res.insertId,
        ...newStandardLayout,
      });
    }
  );
};
module.exports = StandardLayoutModel;
