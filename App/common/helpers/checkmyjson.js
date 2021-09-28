exports.checkMyJson = (checkThis) => {
  console.log("checking if this can be parsed ", checkThis);
  try {
    JSON.parse(checkThis);
  } catch {
    return false;
  }
  return true;
};
