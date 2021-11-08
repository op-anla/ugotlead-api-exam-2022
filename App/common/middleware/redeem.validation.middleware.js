exports.didUserWin = (req, res, next) => {
  console.log("NOW WE CALCULATE WINNING FOR USER", req.body.rewards.length);
  /* 
  We use drawtime on each reward to calculate whether or not the user has won anything. 
  First we get the array of rewards that's actually not claimed yet
  */
  const allRewards = req.body.rewards;
  let allRewardsWithoutConsolationReward = allRewards.filter((reward) => {
    return reward.reward_type != 0;
  });
  let winnableRewards = allRewardsWithoutConsolationReward.filter((reward) => {
    return reward.reward_claimed === 0;
  });
  const amountOfRewardsForPercentage =
    allRewardsWithoutConsolationReward.length;
  let lost_reward = allRewards.filter((reward) => {
    return reward.reward_type === 0;
  });
  const amountOfLeads = req.body.campaign.leads_goal;
  const percentOfWinning = (amountOfRewardsForPercentage / amountOfLeads) * 100;
  console.log("percentOfWinning", percentOfWinning);
  console.log("winnableRewards", winnableRewards.length);
  /* We go through each reward and see which is closest to now (drawtime) */
  /* 
  The chances of each reward depends on what options there is. 
  If the drawtime on rewards is null and the campaign has "Leads" we know to use automatic 

  First priority is always drawtime though!!!
  */
  const now = new Date();
  if (!winnableRewards.length) {
    // No available rewards left so the user lose.
    console.log("The user lost because no available rewards");
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
    req.body.reward = res.locals.redeemInfo.data.reward;
    return next();
  }
  // Use this variable to keep track of the user losing
  let didUserWin = false;
  //
  winnableRewards.forEach((reward) => {
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
      req.body.reward = res.locals.redeemInfo.data.reward;
      return next();
    }
  });
  if (!didUserWin) {
    // Checking automatic winning percentage
    // Here we use automatic percentage to calculate winning
    let baseNum = Math.random() * 100;
    console.log(
      "🚀 ~ file: redeem.validation.middleware.js ~ line 11 ~ baseNum",
      baseNum
    );
    let testPercentage = 90;
    let basePercentage = 100 - percentOfWinning;
    console.log(
      "🚀 ~ file: redeem.validation.middleware.js ~ line 13 ~ basePercentage",
      basePercentage
    );

    //   Test percentage
    // Comment for not testing
    if (baseNum >= basePercentage) {
      let randomRewardToPick =
        winnableRewards[Math.floor(Math.random() * winnableRewards.length)];

      console.log("USER WON");
      // User won
      didUserWin = true;
      res.locals.redeemInfo = {
        won: true,
        data: {
          reward: randomRewardToPick,
        },
      };
      req.body.reward = res.locals.redeemInfo.data.reward;
      return next();
    } else {
      console.log("User did not win!");
      // User lost
      res.locals.redeemInfo = {
        won: false,
        data: {
          reward: lost_reward[0],
        },
      };
      req.body.reward = res.locals.redeemInfo.data.reward;
      return next();
    }
  }
};
exports.didUserWinWithResponse = (req, res, next) => {
  console.log("NOW WE CALCULATE WINNING FOR USER", req.body.rewards.length);
  /* 
  We use drawtime on each reward to calculate whether or not the user has won anything. 
  First we get the array of rewards that's actually not claimed yet
  */
  const allRewards = req.body.rewards;
  let allRewardsWithoutConsolationReward = allRewards.filter((reward) => {
    return reward.reward_type != 0;
  });
  let winnableRewards = allRewardsWithoutConsolationReward.filter((reward) => {
    return reward.reward_claimed === 0;
  });
  const amountOfRewardsForPercentage =
    allRewardsWithoutConsolationReward.length;
  let lost_reward = allRewards.filter((reward) => {
    return reward.reward_type === 0;
  });
  const amountOfLeads = req.body.campaign.leads_goal;
  const percentOfWinning = (amountOfRewardsForPercentage / amountOfLeads) * 100;
  console.log("percentOfWinning", percentOfWinning);
  console.log("winnableRewards", winnableRewards.length);
  /* We go through each reward and see which is closest to now (drawtime) */
  /* 
  The chances of each reward depends on what options there is. 
  If the drawtime on rewards is null and the campaign has "Leads" we know to use automatic 

  First priority is always drawtime though!!!
  */
  const now = new Date();
  if (!winnableRewards.length) {
    // No available rewards left so the user lose.
    console.log("The user lost because no available rewards");
    res.locals.redeemInfo = {
      won: false,
      data: {
        reward: lost_reward[0],
      },
    };
    req.body.reward = res.locals.redeemInfo.data.reward;
    return res.status(200).send(res.locals.redeemInfo);
  }
  // Use this variable to keep track of the user losing
  let didUserWin = false;
  //
  winnableRewards.forEach((reward) => {
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
      req.body.reward = res.locals.redeemInfo.data.reward;
      return res.status(200).send(res.locals.redeemInfo);
    }
  });
  if (!didUserWin) {
    // Checking automatic winning percentage
    // Here we use automatic percentage to calculate winning
    let baseNum = Math.random() * 100;
    console.log(
      "🚀 ~ file: redeem.validation.middleware.js ~ line 11 ~ baseNum",
      baseNum
    );
    let testPercentage = 90;
    let basePercentage = 100 - testPercentage;
    console.log(
      "🚀 ~ file: redeem.validation.middleware.js ~ line 13 ~ basePercentage",
      basePercentage
    );

    //   Test percentage
    // Comment for not testing
    if (baseNum >= basePercentage) {
      let randomRewardToPick =
        winnableRewards[Math.floor(Math.random() * winnableRewards.length)];

      console.log("USER WON");
      // User won
      didUserWin = true;
      res.locals.redeemInfo = {
        won: true,
        data: {
          reward: randomRewardToPick,
        },
      };
      req.body.reward = res.locals.redeemInfo.data.reward;
      return res.status(200).send(res.locals.redeemInfo);
    } else {
      console.log("User did not win!");
      // User lost
      res.locals.redeemInfo = {
        won: false,
        data: {
          reward: lost_reward[0],
        },
      };
      req.body.reward = res.locals.redeemInfo.data.reward;
      return res.status(200).send(res.locals.redeemInfo);
    }
  }
};
