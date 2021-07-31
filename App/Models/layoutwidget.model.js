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
LayoutWidgetModel.updateById = (id, widget, result) => {
  console.log("🚀 ~ file: rewards.model.js ~ line 59 ~ reward", widget)

  sql.query(
    "UPDATE rewards SET    reward_name = ?,    reward_description = ? ,      reward_value = ? ,        reward_value_type = ? ,          reward_image_url = ? ,            reward_type = ? ,            reward_claimed = ?  WHERE reward_id = ?",
    [
      reward.reward_name,
      reward.reward_description,
      reward.reward_value,
      reward.reward_value_type,
      reward.reward_image_url,
      reward.reward_type,
      reward.reward_claimed,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: reward.model.js ~ line 74 ~ err", err)
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found reward with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated reward: ", {
        id: id,
        ...reward
      });
      result(null, {
        id: id,
        ...reward
      });
    }
  );
};
module.exports = LayoutWidgetModel;
