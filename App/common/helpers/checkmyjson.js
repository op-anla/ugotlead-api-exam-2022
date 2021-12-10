exports.checkMyJson = (checkThis) => {
  try {
    JSON.parse(checkThis);
  } catch {
    return false;
  }
  return true;
};
