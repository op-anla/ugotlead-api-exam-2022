const TAG_BANK = require("./TAG_BANK.json");

exports.returnDynamicContent = (checkThis) => {
  console.log("checking if this can be parsed ", checkThis);

  console.log("TAG_BANK", TAG_BANK);
};
