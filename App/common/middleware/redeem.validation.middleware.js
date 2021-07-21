exports.didUserWin = (req, res, next) => {
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

  //   Test percentage
  // Comment for not testing
  var testPercentage = 10;
  if (baseNum >= testPercentage) {
    console.log("USER WON")
    var random = Math.floor(Math.random() * req.body.rewards.length)
    console.log("🚀 ~ file: redeem.validation.middleware.js ~ line 17 ~ choosenReward", random)
    console.log("RANDOM REwARD CHOOSEN", req.body.rewards[random])
    req.body.redeemInfo = {
      won: true,
      data: {
        reward: req.body.rewards[random]
      }
    };
    next()
  } else {
    console.log("DIDNT WIN")

    req.body.redeemInfo = {
      won: false,
      data: {}
    };
    next()
  }
}
