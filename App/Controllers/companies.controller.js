const Company = require("../Models/company.model");

// Find one specific company
exports.findOneCompany = (req, res) => {
  Company.findById(req.params.companyId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found company with id ${req.params.companyId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving company with id " + req.params.companyId,
        });
      }
    } else res.send(data);
  });
};

// Create and Save a new company
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a company
  const company = new Company({
    company_name: req.body.company_name,
    company_email: req.body.company_email,
    company_address: req.body.company_address,
    company_zipcode: req.body.company_zipcode,
    company_city: req.body.company_city,
    company_cvr: req.body.company_cvr,
  });

  // Save company in the database
  Company.create(company, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the company.",
      });
    else res.status(201).send(data);
  });
};

exports.findAll = (req, res) => {
  console.log("find all companies");
  Company.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving campaigns.",
      });
    else res.send(data);
  });
};

// Update a company
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("BODY IN COMPANY", req.body);
  Company.updateById(
    req.params.companyId,
    new Company(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found company with id ${req.params.companyId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating company with id " + req.params.companyId,
          });
        }
      } else res.send(data);
    }
  );
};
// Delete Company
exports.delete = (req, res) => {
  Company.remove(req.params.companyId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Company with id ${req.params.companyId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Company with id " + req.params.companyId,
        });
      }
    } else
      res.send({
        message: `Company was deleted successfully!`,
      });
  });
};
