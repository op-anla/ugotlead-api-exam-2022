exports.didUserWin = (req, res) => {
  console.log("NOW WE CALCULATE WINNING FOR USER", req.body)
  const leads = req.body.campaign.campaign_leads
  console.log("🚀 ~ file: redeem.validation.middleware.js ~ line 4 ~ leads", leads)
  const amountOfRewards = req.body.rewards.length;
  console.log("🚀 ~ file: redeem.validation.middleware.js ~ line 6 ~ amountOfRewards", amountOfRewards)
  const percentOfWinning = (amountOfRewards / leads) * 100;
  console.log("🚀 ~ file: redeem.validation.middleware.js ~ line 8 ~ percentOfWinning", percentOfWinning)

  var baseNum = Math.random() * 100;
  console.log("🚀 ~ file: redeem.validation.middleware.js ~ line 11 ~ baseNum", baseNum)
  var basePercentage = 100 - percentOfWinning;
  console.log("🚀 ~ file: redeem.validation.middleware.js ~ line 13 ~ basePercentage", basePercentage)
  if (baseNum >= basePercentage) {
    console.log("USER WON")

  } else {
    console.log("DIDNT WIN")
  }
}
