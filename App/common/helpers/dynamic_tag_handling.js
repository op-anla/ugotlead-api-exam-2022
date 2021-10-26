module.exports = {
  returnDynamicContent: function (payload) {
    let content;
    if (payload.didUserWin) {
      // We know the function was called from "Sendwinnermail"
      content = payload.emailInfo.email_win_text;
    } else {
      // We know the function was called from SendLoserMail
      content = payload.emailInfo.email_consolation_text;
    }
    let regex = /\{{(.*?)\}}/g;
    let foundTags = content.match(regex);

    if (Array.isArray(foundTags) && foundTags.length) {
      // We actually found some tags
      foundTags.forEach((tag) => {
        if (tag.includes("user_name")) {
          // Username check
          content = content.replace(`{{user_name}}`, payload.userName);
        }
        if (tag.includes("reward")) {
          // Reward check
          let rewardContent = `
          <strong>Gevinst navn: ${payload.reward.reward_name}</strong>
          `;

          content = content.replace(`{{reward}}`, rewardContent);
        }
      });
      return content;
    } else {
      return null;
    }
  },
};
