const sql = require("./db.js");
var cluster = require("cluster");
var myCache = require("cluster-node-cache")(cluster);

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
module.exports = StandardLayoutCompModel;
