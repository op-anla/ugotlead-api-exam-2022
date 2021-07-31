const sql = require("./db.js");

// constructor
const LayoutWidgetModel = function (widget) {
  this.template_layout_name = widget.name;
  this.template_layout_content = widget.content;
  this.template_layout_options = widget.options;
  this.template_layout_pos_x = widget.x;
  this.template_layout_pos_y = widget.y;
  this.template_layout_size_h = widget.h;
  this.template_layout_size_w = widget.w;
};
LayoutWidgetModel.getAll = result => {
  sql.query("SELECT * FROM template_layout_components", async (err, res) => {
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err", err)
      result(null, err);
      return;
    }
    result(null, res);
  });
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
LayoutWidgetModel.updateById = (id, widget, result) => {
  console.log("🚀 ~ file: layoutwidget.model.js ~ line 35 ~ widget", widget)

  sql.query(
    "UPDATE template_layout_components SET    template_layout_name = ?,    template_layout_content = ? ,      template_layout_options = ? ,        template_layout_pos_x = ? ,          template_layout_pos_y = ? ,            template_layout_size_h = ? ,            template_layout_size_w = ?  WHERE template_layout_id = ?",
    [
      widget.name,
      widget.content,
      widget.options,
      widget.x,
      widget.y,
      widget.h,
      widget.w,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: layoutwidget.model.js ~ line 51 ~ err", err)
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found widget with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated widget: ", {
        id: id,
        ...widget
      });
      result(null, {
        id: id,
        ...widget
      });
    }
  );
};
module.exports = LayoutWidgetModel;
