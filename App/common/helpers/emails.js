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
        setTimeout(() => {
          this.retryEmailAfterError(fromMail, toMail, subject, content);
        }, 0);
        result(err, null);
      } else {
        result(null, info);
      }
    }
  );
};
exports.retryEmailAfterError = async (fromMail, toMail, subject, content) => {
  console.log("We got an error before and now we try sending an email again");
  await mailSetup.sendMail(
    {
      from: fromMail,
      to: toMail,
      subject: subject,
      html: content,
    },
    (err, info) => {
      if (err) {
        // Error
        console.log("We still got an error trying to send emails", err);
        setTimeout(() => {
          this.retryEmailAfterError(fromMail, toMail, subject, content);
        }, 0);
      } else {
        console.log("We tried after email error and now it works!");
      }
    }
  );
};
