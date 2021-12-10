const mailSetup = require("../../Models/emailsetup");

exports.sendMail = (fromMail, toMail, subject, content, result) => {
  mailSetup.sendMail(
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
