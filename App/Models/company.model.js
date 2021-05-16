const sql = require("./db.js");

// constructor
const Company = function (company) {
  this.company_name = company.company_name;
  this.company_email = company.company_email;
  this.company_address = company.company_address;
  this.company_zipcode = company.company_zipcode;
};
Company.create = (newCompany, result) => {
  sql.query("INSERT INTO companies SET ?", newCompany, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created company: ", {
      id: res.insertId,
      ...newCompany
    });
    result(null, {
      id: res.insertId,
      ...newCompany
    });
  });
};
module.exports = Company;
