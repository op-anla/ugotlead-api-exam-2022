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
        return res.status(400).send();
      } else {
        console.log(info);
        return res.status(200).send();
      }
    }
  );
};
