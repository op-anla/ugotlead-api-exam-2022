const email = require("../../Controllers/email.controller");

exports.didUserWin = (req, res, next) => {
  /* 
  We use drawtime on each reward to calculate whether or not the user has won anything. 
  First we get the array of rewards that's actually not claimed yet
  */
  const allRewards = res.locals.rewards;
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
  /* We go through each reward and see which is closest to now (drawtime) */
  /* 
  The chances of each reward depends on what options there is. 
  If the drawtime on rewards is null and the campaign has "Leads" we know to use automatic 

  First priority is always drawtime though!!!
  */
  const now = new Date();
  if (!winnableRewards.length) {
    // No available rewards left so the user lose.
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
    let testPercentage = 90;
    let basePercentage = 100 - percentOfWinning;

    //   Test percentage
    // Comment for not testing
    if (baseNum >= basePercentage) {
      let randomRewardToPick =
        winnableRewards[Math.floor(Math.random() * winnableRewards.length)];

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
  /* 
  We use drawtime on each reward to calculate whether or not the user has won anything. 
  First we get the array of rewards that's actually not claimed yet
  */
  const allRewards = res.locals.rewards;
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
  /* We go through each reward and see which is closest to now (drawtime) */
  /* 
  The chances of each reward depends on what options there is. 
  If the drawtime on rewards is null and the campaign has "Leads" we know to use automatic 

  First priority is always drawtime though!!!
  */
  const now = new Date();
  if (!winnableRewards.length) {
    // No available rewards left so the user lose.
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
    let testPercentage = 90;
    let basePercentage = 100 - testPercentage;

    //   Test percentage
    // Comment for not testing
    if (baseNum >= basePercentage) {
      let randomRewardToPick =
        winnableRewards[Math.floor(Math.random() * winnableRewards.length)];

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
