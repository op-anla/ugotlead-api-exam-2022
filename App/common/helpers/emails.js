const mailSetup = require("../../Models/emailsetup");

exports.sendMail = async (fromMail, toMail, subject, content, result) => {
  mailSetup.sendMail(
    {
      from: fromMail,
      to: toMail,
      subject: subject,
      html: content,
    },
    async (err, info) => {
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
exports.retryEmailAfterError = async (
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
  await mailSetup.sendMail(
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
        if (currentNum >= 10) {
          throw new Error(
            "We tried sending emails 10 times, now it's time to stop the madness...",
            err
          );
        } else {
          setTimeout(() => {
            console.log(
              "This was executed after 60 seconds because we got error on error in email. We try sending email again every 60 seconds !"
            );
            this.retryEmailAfterError(
              fromMail,
              toMail,
              subject,
              content,
              currentNum
            );
          }, 60000);
        }
      } else {
        console.log("We tried after email error and now it works!");
      }
    }
  );
};
