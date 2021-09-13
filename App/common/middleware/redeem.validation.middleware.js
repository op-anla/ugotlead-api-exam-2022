exports.didUserWin = (req, res, next) => {
  console.log("NOW WE CALCULATE WINNING FOR USER");
  /* 
  We use drawtime on each reward to calculate whether or not the user has won anything. 
  First we get the array of rewards that's actually not claimed yet
  */
  let notClaimedRewards = req.body.rewards.filter((reward) => {
    return reward.reward_claimed === 0;
  });
  let viableRewards = notClaimedRewards.filter((reward) => {
    return reward.reward_drawtime !== null;
  });
  console.log("notClaimedRewards ~ notClaimedRewards", viableRewards);
  /* We go through each reward and see which is closest to now (drawtime) */
  const now = new Date();
  if (!viableRewards.length) {
    // No available rewards left so the user lose.
    res.locals.redeemInfo = null;
  }
  viableRewards.forEach((reward) => {
    let drawTime = new Date(reward.reward_drawtime);
    console.log("viableRewards.forEach ~ drawTime", drawTime, now);
    console.log(
      "comparing - If true then user has won (meaning date now is later than drawtime == win)",
      now >= drawTime
    );
    if (now >= drawTime) {
      // User won
      res.locals.redeemInfo = {
        won: true,
        data: {
          reward: reward,
        },
      };
      return next();
    }
  });
};
