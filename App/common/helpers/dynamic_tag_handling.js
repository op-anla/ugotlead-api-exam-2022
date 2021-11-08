const ugotleadEmailHelper = require("./ugotleadEmailHelper");

module.exports = {
  returnDynamicContent: function (payload) {
    let content = payload.content;
    content = ugotleadEmailHelper.addTemplateContent(content);
    const regex = /\{{(.*?)\}}/g;
    const foundTags = content.match(regex);

    if (Array.isArray(foundTags) && foundTags.length) {
      // We actually found some tags
      foundTags.forEach((tag) => {
        if (tag.includes("user_name")) {
          // Username check
          content = content.replace(`{{user_name}}`, payload.userInfo.navn);
        }
        if (tag.includes("reward")) {
          // Reward check
          let rewardContent = `
           <p><strong>Gevinst navn:</strong> ${payload.reward.reward_name} </p>
           <p><strong>Gevinst detaljer:</strong><br> ${payload.reward.reward_description} </p>
           <p><strong>Gevinst værdien:</strong>${payload.reward.reward_value} </p>
          `;

          content = content.replace(`{{reward}}`, rewardContent);
        }
        if (tag.includes("user_info")) {
          // Userinfo
          let userInfoContent = `
          <p><strong>Navn: </strong>${payload.userInfo.navn}</p>
          <p><strong>Email: </strong>${payload.userInfo.email}</p>
          `;
          content = content.replace(`{{user_info}}`, userInfoContent);
        }
        if (tag.includes("user_name")) {
          // Username
          content = content.replace(`{{user_name}}`, payload.userInfo.navn);
        }
        if (tag.includes("user_email")) {
          // Email
          content = content.replace(`{{user_email}}`, payload.userInfo.email);
        }
        if (tag.includes("reward_name")) {
          // Reward name
          content = content.replace(
            `{{reward_name}}`,
            payload.reward.reward_name
          );
        }
        if (tag.includes("reward_description")) {
          // Reward description
          content = content.replace(
            `{{reward_description}}`,
            payload.reward.reward_description
          );
        }
        if (tag.includes("reward_value")) {
          // Reward value
          content = content.replace(
            `{{reward_value}}`,
            payload.reward.reward_value
          );
        }
      });
      return content;
    } else {
      return content;
    }
  },
};
