exports.validateDomain = (req, res, next) => {
  console.log("VALIDATE DOMAIN", req.headers, req.body);
  console.log("CAMPAIGN ROUTE PARAMS", req.params)
  const acceptedVariables = {
    host: "127.0.0.1:3005",
    origin: 'http://127.0.0.1:3306',
    referer: 'http://127.0.0.1:3306/'
  }
  if (req.headers.host == acceptedVariables.host) {
    console.log("Accepted host")
    if (req.headers.origin == acceptedVariables.origin) {
      console.log("Accepted origin")
      if (req.headers.referer == acceptedVariables.referer) {
        console.log("Accepted referer and now we go NEXT");
        next();
      } else {
        console.log("REJECTED REFERER")
      }
    } else {
      console.log("REJECTED ORIGIN")
    }
  } else {
    console.log("REJECTED HOST")
  }

}
