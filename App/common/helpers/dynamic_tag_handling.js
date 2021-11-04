module.exports = {
  returnDynamicContent: function (payload) {
    let content = payload.content;
    console.log("content", content);

    let regex = /\{{(.*?)\}}/g;
    let foundTags = content.match(regex);

    if (Array.isArray(foundTags) && foundTags.length) {
      // We actually found some tags
      foundTags.forEach((tag) => {
        if (tag.includes("user_name")) {
          // Username check
          content = content.replace(`{{user_name}}`, payload.userInfo.userName);
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
      return content;
    }
  },
};
