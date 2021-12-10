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
          this.retryEmailAfterError(fromMail, toMail, subject, content, 0);
        }, 0);
        result(err, null);
      } else {
        result(null, info);
      }
    }
  );
};
exports.retryEmailAfterError = (
  fromMail,
  toMail,
  subject,
  content,
  numOfTries
) => {
  console.log(
    "We got an error before and now we try sending an email again - current num count: ",
    numOfTries
  );
  mailSetup.sendMail(
    {
      from: fromMail,
      to: toMail,
      subject: subject,
      html: content,
    },
    (err, info) => {
      if (err) {
        let currentNum = numOfTries++;
        // Error
        console.log(
          "We still got an error trying to send emails",
          err.responseCode,
          "Our current try count is: ",
          numOfTries
        );
        if (currentNum >= 100) {
          throw new Error(
            "We tried sending emails 100 times, now it's time to stop the madness...",
            err
          );
        } else {
          setTimeout(() => {
            this.retryEmailAfterError(
              fromMail,
              toMail,
              subject,
              content,
              currentNum
            );
          }, 0);
        }
      } else {
        console.log("We tried after email error and now it works!");
      }
    }
  );
};
