const sql = require("./db.js");

// constructor
const LayoutWidgetModel = function (widget) {
  this.template_layout_name = widget.template_layout_name;
  this.template_layout_content = widget.template_layout_content;
  this.template_layout_options = widget.template_layout_options;
  this.template_layout_pos_x = widget.template_layout_pos_x;
  this.template_layout_pos_y = widget.template_layout_pos_y;
  this.template_layout_size_h = widget.template_layout_size_h;
  this.template_layout_size_w = widget.template_layout_size_w;
};

LayoutWidgetModel.create = (newWidget, result) => {
  sql.query("INSERT INTO template_layout_components SET ?", newWidget, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    console.log("created widget: ", {
      id: res.insertId,
      ...newWidget
    });

    result(null, {
      id: res.insertId,
      ...newWidget
    });

  });
};

module.exports = LayoutWidgetModel;
