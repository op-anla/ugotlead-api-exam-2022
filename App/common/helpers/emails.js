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
const maxEmails = 3000 - 1;
let counter = 0;
let maxReached = false;
exports.sendMailThroughMailgun = (
  fromMail,
  toMail,
  subject,
  content,
  result
) => {
  console.log("Sending email through mailgun now!", counter);
  counter++;
  if (maxReached) {
    return;
  }
  if (counter >= maxEmails) {
    console.log("Reached max emails, return now!");
    maxReached = true;
    emailSetup.mailgunTransporter.sendMail(
      {
        from: "anla@onlineplus.dk",
        to: "anla@onlineplus.dk",
        subject: "DU HAR NÅET MAX EMAILS!",
        html: "Maks emails er nået på mailgun",
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
    throw new Error("Nået max antal emails. Stopper med at sende nu");
  }
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
