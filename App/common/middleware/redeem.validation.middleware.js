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
    return reward.reward_drawtime !== null && reward.reward_type != 0;
  });
  console.log("viableRewards ~ viableRewards", viableRewards);
  /* We go through each reward and see which is closest to now (drawtime) */
  let lost_reward = req.body.rewards.filter((reward) => {
    return reward.reward_type === 0;
  });
  const now = new Date();
  if (!viableRewards.length) {
    // No available rewards left so the user lose.
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
  }
  // Use this variable to keep track of the user losing
  let didUserWin = false;
  viableRewards.forEach((reward) => {
    let drawTime = new Date(reward.reward_drawtime);
    console.log("viableRewards.forEach ~ drawTime", drawTime, now);
    console.log(
      "comparing - If true then user has won (meaning date now is later than drawtime == win)",
      now >= drawTime
    );
    if (now >= drawTime) {
      // User won
      didUserWin = true;
      res.locals.redeemInfo = {
        won: true,
        data: {
          reward: reward,
        },
      };
      return next();
    }
  });
  // Since there is no async code inside foreach it will be syncronous - meaning code after here runs after foreach
  if (!didUserWin) {
    // User lost
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
    return next();
  }
};
