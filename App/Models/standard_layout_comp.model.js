const sql = require("./db.js");

// constructor
const StandardLayoutCompModel = function (newStandardLayoutComp) {
  this.standard_layout_id = newStandardLayoutComp.standard_layout_id;
  this.standard_layout_comp_options =
    newStandardLayoutComp.standard_layout_comp_options;
  this.standard_layout_comp_content =
    newStandardLayoutComp.standard_layout_comp_content;
  this.standard_layout_comp_pos_x =
    newStandardLayoutComp.standard_layout_comp_pos_x;
  this.standard_layout_comp_pos_y =
    newStandardLayoutComp.standard_layout_comp_pos_y;
  this.standard_layout_comp_size_w =
    newStandardLayoutComp.standard_layout_comp_size_w;
  this.standard_layout_comp_size_h =
    newStandardLayoutComp.standard_layout_comp_size_h;
};
StandardLayoutCompModel.create = (newStandardLayoutComp, result) => {
  console.log(
    "🚀 ~ file: standard_layout_comp.model.js ~ line 22 ~ newStandardLayoutComp",
    newStandardLayoutComp
  );
  sql.query(
    "INSERT INTO standard_layouts_comps SET ?",
    newStandardLayoutComp,
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: standard_layout_comp.model.js ~ line 27 ~ err",
          err
        );

        result(err, null);
        return;
      }

      console.log("created standard layout comp: ", {
        id: res.insertId,
        // Spread operator to extend the object with data
        ...newStandardLayoutComp,
      });

      result(null, {
        id: res.insertId,
        ...newStandardLayoutComp,
      });
    }
  );
};
StandardLayoutCompModel.updateById = (layoutComp, layoutCompId, result) => {
  console.log("layoutcomp in model", layoutComp);
  sql.query(
    "UPDATE standard_layouts_comps SET  ?   WHERE standard_layout_comp_id = ?",
    [layoutComp, layoutCompId],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: campaign.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found standard layout component with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated standard layout component: ", {
        id: layoutCompId,
        ...layoutComp,
      });
      result(null, {
        id: layoutCompId,
        ...layoutComp,
      });
    }
  );
};
StandardLayoutCompModel.getAllFromLayoutId = (layoutId, result) => {
  sql.query(
    "SELECT * FROM standard_layouts_comps WHERE standard_layout_id = ? LIMIT 10 ",
    layoutId,
    async (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
          err
        );
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};
StandardLayoutCompModel.remove = (id, result) => {
  sql.query(
    "DELETE FROM standard_layouts_comps WHERE standard_layout_comp_id = ?",
    id,
    (err, res) => {
      if (err) {
        console.log("err", err);

        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found StandardLayoutModel with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log(
        "deleted StandardLayoutModel with StandardLayoutModel_id: ",
        id
      );
      result(null, res);
    }
  );
};
module.exports = StandardLayoutCompModel;
