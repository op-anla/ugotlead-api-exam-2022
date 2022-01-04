const emailSetup = require("../../Models/emailsetup");

exports.sendMailThroughOutlook = (
  fromMail,
  toMail,
  subject,
  content,
  result
) => {
  emailSetup.outlookTransporter.sendMail(
    {
      from: fromMail,
      to: toMail,
      subject: subject,
      html: content,
    },
    (err, info) => {
      if (err) {
        // Error
        console.log("We have an issue with sending emails - ", err);
        result(err, null);
      } else {
        result(null, info);
      }
    }
  );
};
exports.sendMailThroughMailgun = (
  fromMail,
  toMail,
  subject,
  content,
  result
) => {
  emailSetup.mailgunTransporter.sendMail(
    {
      from: "anla@onlineplus.dk",
      to: "anla@onlineplus.dk",
      subject: subject,
      html: content,
    },
    (err, info) => {
      if (err) {
        // Error
        console.log("We have an issue with sending emails - ", err);
        result(err, null);
      } else {
        result(null, info);
      }
    }
  );
};
