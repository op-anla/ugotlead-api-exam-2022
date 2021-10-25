const TAG_BANK = require("./TAG_BANK.json");

module.exports = {
  returnDynamicContent: function (contentToMatch) {
    let regex = /\{{(.*?)\}}/g;
    let foundTags = contentToMatch.match(regex);
    console.log("TAG_BANK", TAG_BANK, foundTags);

    if (Array.isArray(foundTags) && foundTags.length) {
      // We actually found some tags
      let formattedArray = [];
      foundTags.forEach((tag) => {
        console.log("foundTags.forEach ~ tag", tag);
        if (typeof TAG_BANK[tag] === "object") {
          //   Found a tag
          formattedArray.push(TAG_BANK[tag].replaceWith);
        }
      });
      module.exports.returnFormattedContentFromDynamic(formattedArray);
      return formattedArray;
    } else {
      return null;
    }
  },
  returnFormattedContentFromDynamic: function (
    contentToMatch,
    contentToReplaceWith
  ) {
    console.log("contentToMatch", contentToMatch);
  },
};
