exports.didUserWin = (req, res, next) => {
  console.log(
    "NOW WE CALCULATE WINNING FOR USER",
    req.body.rewards.length,
    "CAMPAIGN INFO",
    req.body.campaign
  );
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
    console.log("The user lost because no available rewards");
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
    return next();
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
exports.didUserWinWithResponse = (req, res, next) => {
  console.log(
    "NOW WE CALCULATE WINNING FOR USER",
    req.body.rewards.length,
    "CAMPAIGN INFO",
    req.body.campaign
  );
  /* 
  We use drawtime on each reward to calculate whether or not the user has won anything. 
  First we get the array of rewards that's actually not claimed yet
  */
  let notClaimedRewards = req.body.rewards.filter((reward) => {
    return reward.reward_claimed === 0;
  });
  let viableRewards = notClaimedRewards.filter((reward) => {
    return reward.reward_type != 0;
  });
  const amountOfViableRewards = viableRewards.length;
  let lost_reward = req.body.rewards.filter((reward) => {
    return reward.reward_type === 0;
  });
  const amountOfLeads = req.body.campaign.leads_goal;
  const percentOfWinning = (amountOfViableRewards / amountOfLeads) * 100;
  console.log("percentOfWinning", percentOfWinning);
  console.log("viableRewards ~ viableRewards", viableRewards.length);
  /* We go through each reward and see which is closest to now (drawtime) */
  /* 
  The chances of each reward depends on what options there is. 
  If the drawtime on rewards is null and the campaign has "Leads" we know to use automatic 

  First priority is always drawtime though!!!
  */
  const now = new Date();
  if (!viableRewards.length) {
    // No available rewards left so the user lose.
    console.log("The user lost because no available rewards");
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
    return res.status(200).send(res.locals.redeemInfo);
  }
  // Use this variable to keep track of the user losing
  let didUserWin = false;
  viableRewards.forEach((reward) => {
    if (reward.reward_drawtime == null) {
      return;
    }
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
      return res.status(200).send(res.locals.redeemInfo);
    }
  });
  // Checking automatic winning percentage
  // Here we use automatic percentage to calculate winning
  let baseNum = Math.random() * 100;
  console.log(
    "🚀 ~ file: redeem.validation.middleware.js ~ line 11 ~ baseNum",
    baseNum
  );
  let testPercentage = 100 - 30;
  let basePercentage = 100 - percentOfWinning;
  console.log(
    "🚀 ~ file: redeem.validation.middleware.js ~ line 13 ~ basePercentage",
    basePercentage
  );

  //   Test percentage
  // Comment for not testing
  if (baseNum >= basePercentage) {
    let randomRewardToPick =
      viableRewards[Math.floor(Math.random() * viableRewards.length)];

    console.log("USER WON");
    // User won
    didUserWin = true;
    res.locals.redeemInfo = {
      won: true,
      data: {
        reward: randomRewardToPick,
      },
    };
    return res.status(200).send(res.locals.redeemInfo);
  } else {
    console.log("User did not win!");
  }
  // Since there is no async code inside foreach it will be syncronous - meaning code after here runs after foreach
  if (!didUserWin) {
    // User lost
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
    return res.status(200).send(res.locals.redeemInfo);
  }
};
