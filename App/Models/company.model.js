const sql = require("./db.js");

// constructor
const Company = function (company) {
  this.company_name = company.company_name;
  this.company_email = company.company_email;
  this.company_address = company.company_address;
  this.company_zipcode = company.company_zipcode;
  this.company_city = company.company_city;
  this.company_cvr = company.company_cvr;
};

Company.create = (newCompany, result) => {
  sql.query("INSERT INTO companies SET ?", newCompany, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: company.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created company: ", {
      id: res.insertId,
      ...newCompany,
    });
    result(null, {
      id: res.insertId,
      ...newCompany,
    });
  });
};
Company.findById = (companyId, result) => {
  sql.query(
    `SELECT * FROM companies WHERE company_id = ?`,
    companyId,
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: company.model.js ~ line 39 ~ err", err);

        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found company: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Company with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
    }
  );
};
Company.getAll = (result) => {
  sql.query("SELECT * FROM companies", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Company.countAll = (result) => {
  sql.query("SELECT COUNT(*) FROM companies", async (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Company.updateById = (id, company, result) => {
  console.log("Update this company with: ", company);
  sql.query(
    "UPDATE companies SET   ?  WHERE company_id = ?",
    [company, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: campaign.model.js ~ line 74 ~ err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found campaign with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated company: ", {
        id: id,
        ...company,
      });
      result(null, {
        id: id,
        ...company,
      });
    }
  );
};
Company.remove = (id, result) => {
  sql.query("DELETE FROM companies WHERE company_id = ?", id, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: company.model.js ~ line 51 ~ sql.query ~ err",
        err
      );
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Company with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
      return;
    }

    console.log("deleted company with company_id: ", id);
    result(null, res);
  });
};
module.exports = Company;
