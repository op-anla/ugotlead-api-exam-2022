const Company = require("../Models/company.model");

// Create and Save a new company
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const company = new Company({
    company_name: req.body.company_name,
    company_email: req.body.company_email,
    company_address: req.body.company_address,
    company_zipcode: req.body.company_zipcode
  });

  // Save Customer in the database
  Company.create(company, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the company."
      });
    else res.send(data);
  });



};

exports.findAll = (req, res) => {
  console.log("find all companies");
  Company.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving campaigns."
      });
    else res.send(data);
  });
};
