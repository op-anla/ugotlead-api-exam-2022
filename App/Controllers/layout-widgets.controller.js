const LayoutWidgetModel = require("../Models/layoutwidget.model");

/* 
-----------------------------------------------
LAYOUTWIDGET
-----------------------------------------------
*/
exports.createwidget = (req, res) => {
  console.log("🚀 ~ file: entry.controller.js ~ line 9 ~ req", req.body)
  const newWidget = new LayoutWidgetModel({
    template_layout_name: req.body.name,
    template_layout_content: req.body.content,
    template_layout_options: req.body.options,
    template_layout_pos_x: req.body.x,
    template_layout_pos_y: req.body.y,
    template_layout_size_h: req.body.h,
    template_layout_size_w: req.body.w
  });

  // Save layout widget in db
  LayoutWidgetModel.create(newWidget, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the widget."
      });
    else {
      console.log("DATA IN LOG", data)
      res.status(200).send({
        message: "Added widget",
        data: data,
      })
    }
  })
};

// Update reward by id
exports.updateWidget = (req, res) => {
  console.log("🚀 ~ file: rewards.controller.js ~ line 56 ~ req.body", req.body)
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  LayoutWidgetModel.updateById(
    req.params.widgetId,
    new LayoutWidgetModel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found widget with id ${req.params.widgetId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating widget with id " + req.params.widgetId
          });
        }
      }
      res.status(200).send("Updated widget with id: " + req.params.widgetId)
    }
  );
};
