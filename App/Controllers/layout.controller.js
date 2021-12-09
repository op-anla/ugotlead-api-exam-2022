const Layout = require("../Models/layout.model");
const redisCache = require("./redisCache.controller.js");

/* 
-----------------------------------------------
LAYOUT
-----------------------------------------------
*/
// Retrieve all campaigns from the database.
exports.findLayoutForSpecificCampaign = async (req, res) => {
  // Before getting data from Database we need to check cache
  const cachedResponse = await redisCache.getKey(
    `cache_layout_for_campaign_${req.params.campaignId}`
  );
  if (cachedResponse != null || cachedResponse != undefined) {
    return res.status(200).send(JSON.parse(cachedResponse));
  }
  Layout.findLayoutForCampaign(req.params.campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send("Can't find layout for this specific campaign");
      } else {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving the layouts for that specific campaign.",
        });
      }
    } else {
      // Save in Redis cache
      redisCache.saveKey(
        `cache_layout_for_campaign_${req.params.campaignId}`,
        60 * 60 * 24,
        JSON.stringify(data)
      );
      res.status(200).send(data);
    }
  });
};
exports.updateLayoutForSpecificCampaign = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("TRYING TO UPDATE LAYOUT", req.body, req.params.campaignId);
  Layout.updateLayoutByCampaignId(
    req.params.campaignId,
    req.body.id,
    new Layout({
      layout_component_content: req.body.content,
      layout_component_options: req.body.options,
      layout_component_pos_x: req.body.x,
      layout_component_pos_y: req.body.y,
      layout_component_size_w: req.body.w,
      layout_component_size_h: req.body.h,
    }),
    (err, data) => {
      if (err) {
        console.log("🚀 ~ file: layout.controller.js ~ line 34 ~ err", err);
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found layout with id ${req.body.layout_id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating layout with id " + req.body.layout_id,
          });
        }
      } else {
        // Delete cache for this specific campaign
        redisCache.deleteKey(
          `cache_layout_for_campaign_${req.params.campaignId}`
        );
        res.send(data);
      }
    }
  );
};
// Delete widget from campaign
exports.removeWidgetFromCampaign = (req, res) => {
  Layout.remove(req.params.campaignId, req.body.widgetid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Layout with id ${req.params.campaignId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Layout with id " + req.params.campaignId,
        });
      }
    } else {
      // Delete cache for this specific campaign
      redisCache.deleteKey(
        `cache_layout_for_campaign_${req.params.campaignId}`
      );
      res.send({
        message: `Layout was deleted successfully!`,
      });
    }
  });
};
// Create new component in layout
exports.createNewComponentForCampaign = (req, res) => {
  console.log("🚀 ~ file: entry.controller.js ~ line 9 ~ req", req.body);
  const newWidget = new Layout({
    layout_component_content: req.body.content,
    layout_component_options: req.body.options,
    layout_component_pos_x: req.body.x,
    layout_component_pos_y: req.body.y,
    layout_component_size_h: req.body.h,
    layout_component_size_w: req.body.w,
  });

  // Save layout widget in db
  Layout.create(newWidget, req.params.campaignId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the widget.",
      });
    } else {
      console.log("DATA IN LOG", data);
      // Delete cache for this specific campaign
      redisCache.deleteKey(
        `cache_layout_for_campaign_${req.params.campaignId}`
      );
      res.status(201).send({
        message: "Added widget",
        data: data,
      });
    }
  });
};
