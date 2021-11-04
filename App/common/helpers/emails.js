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
        console.log(err);
        result(err, null);
      } else {
        console.log(info);
        result(null, info);
      }
    }
  );
};
