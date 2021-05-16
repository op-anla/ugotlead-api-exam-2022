const sql = require("./db.js");

// constructor
const Template = function (template) {
  this.owner_email = template.owner_email;
  this.owner_name = template.owner_name;
};
Template.create = (newTemplate, result) => {
  sql.query("INSERT INTO templates SET ?", newTemplate, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created template: ", {
      id: res.insertId,
      ...newTemplate
    });
    result(null, {
      id: res.insertId,
      ...newTemplate
    });
  });
};
Template.findById = (templateId, result) => {
  sql.query(`SELECT * FROM templates WHERE id = ${templateId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found template: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({
      kind: "not_found"
    }, null);
  });
};
Template.remove = (id, result) => {
  sql.query("DELETE FROM templates WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({
        kind: "not_found"
      }, null);
      return;
    }

    console.log("deleted template with id: ", id);
    result(null, res);
  });
};
Template.updateById = (id, template, result) => {
  sql.query(
    "UPDATE templates SET owner_email = ?, owner_name = ? WHERE id = ?",
    [template.owner_email, template.owner_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found template with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated template: ", {
        id: id,
        ...template
      });
      result(null, {
        id: id,
        ...template
      });
    }
  );
};
Template.getAll = result => {
  sql.query("SELECT * FROM templates", async (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("templates: ", res);
    result(null, res);
  });
};

module.exports = Template;
