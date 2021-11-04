const mailSetup = require("../../Models/emailsetup");

exports.sendMail = async (fromMail, toMail, subject, content) => {
  return mailSetup.sendMail(
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
        throw new Error(500);
      } else {
        console.log(info);
        return 200;
      }
    }
  );
};
