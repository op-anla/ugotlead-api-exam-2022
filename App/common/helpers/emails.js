exports.sendMail = (payload) => {
  console.log("payload", payload);
  console.log("let's see emailinfo ", payload.emailInfo);
  let emailInfo = payload.emailInfo;
  let toUserMail = payload.currentUser.email;
  let toUserName = payload.currentUser.navn;
  let reward = payload.redeemInfo.reward;
  let didUserWin = payload.redeemInfo.won;
  console.log(
    "Lets just check the data we send to the email. Did the user win? ",
    didUserWin,
    "What is the mail?",
    toUserMail,
    "What is the name?",
    toUserName,
    "what is the reward?",
    reward
  );
  if (didUserWin) {
    sendWinnerMail(toUserMail, toUserName, reward, emailInfo, didUserWin);
  } else {
    sendLoserMail(toUserMail, toUserName, reward, emailInfo, didUserWin);
  }
  async function sendWinnerMail(
    userEmail,
    userName,
    reward,
    emailInfo,
    didUserWin
  ) {
    console.log(
      "sendWinnerMail ~ userEmail, userName, reward, emailInfo",
      userEmail,
      userName,
      reward,
      emailInfo
    );
    // We send a winner mail here
    let subject = "Tillykke ! - Du har vundet !";
    /* 
    We need to validate the emailinfo since we need some logo and other stuff
    */
    // Validate now
    let payload = {
      userEmail,
      userName,
      reward,
      emailInfo,
      didUserWin,
    };
    const replaceContent = dynamic_tag_handling.returnDynamicContent(payload);
    console.log("replaceContent", replaceContent);
    // We send a winner mail here
    mailSetup.sendMail(
      {
        from: "no-reply@ugotlead.dk",
        to: userEmail,
        subject: subject,
        html: replaceContent,
      },
      (err, info) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
          // Error
        } else {
          console.log(info);
          return res.status(200).send();
        }
      }
    );
  }
  async function sendLoserMail(
    userEmail,
    userName,
    reward,
    emailInfo,
    didUserWin
  ) {
    console.log(
      "sendLoserMail ~ userEmail, userName, reward, emailInfo",
      userEmail,
      userName,
      reward,
      emailInfo
    );
    let subject = "Du vandt desværre ikke...";
    // Validate now
    let payload = {
      userEmail,
      userName,
      reward,
      emailInfo,
      didUserWin,
    };
    const replaceContent = dynamic_tag_handling.returnDynamicContent(payload);
    console.log("replaceContent", replaceContent);
    // We send a winner mail here
    mailSetup.sendMail(
      {
        from: "no-reply@ugotlead.dk",
        to: userEmail,
        subject: subject,
        html: replaceContent,
      },
      (err, info) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
          // Error
        } else {
          console.log(info);
          return res.status(200).send();
        }
      }
    );
  }
};
