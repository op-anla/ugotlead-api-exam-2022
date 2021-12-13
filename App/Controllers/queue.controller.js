// Including the async module
const async = require("async");
const mailchimpController = require("./mailchimpController.controller.js");
const heyLoyaltyController = require("./heyLoyaltyController.controller.js");
// Initializing the queue
const mailchimpQueue = async.queue((task, executed) => {
  setTimeout(() => {
    // Number of tasks remaining and to be processed
    const tasksRemaining = heyloyalty.length();

    mailchimpController
      .addMemberToMailchimp(task.req, task.res)
      .then((res) => {
        console.log("mailchimp member added : ", res);
        executed(null, { task, tasksRemaining });
      })
      .catch((e) => {
        console.log("heyLoyaltyController.addMemberToMailchimp ~ e", e);
        // Tilføj task igen til toppen
        mailchimpQueue.unshift(task);
      });
  }, task.msDelay);
});
// Executes when the queue is done processing all the items
mailchimpQueue.drain(() => {
  console.log("Successfully processed all users for Mailchimp!");
});
// HEYLOYALTY
const heyloyalty = async.queue((task, executed) => {
  setTimeout(() => {
    // Number of tasks remaining and to be processed
    const tasksRemaining = heyloyalty.length();

    heyLoyaltyController
      .addMemberToHeyLoyalty(task.req, task.res)
      .then((res) => {
        console.log("heyloyalty member added : ", res);
        executed(null, { task, tasksRemaining });
      })
      .catch((e) => {
        console.log("heyLoyaltyController.addMemberToHeyLoyalty ~ e", e);
        // Tilføj task igen til toppen
        heyloyalty.unshift(task);
      });
  }, task.msDelay);
}, 1); // concurrency value = 1
// Executes when the queue is done processing all the items
heyloyalty.drain(() => {
  console.log("Successfully processed all users for Heyloyalty!");
});
// EMAIL
const heyloyalty = async.queue((task, executed) => {
  setTimeout(() => {
    // Number of tasks remaining and to be processed
    const tasksRemaining = heyloyalty.length();

    heyLoyaltyController
      .addMemberToHeyLoyalty(task.req, task.res)
      .then((res) => {
        console.log("heyloyalty member added : ", res);
        executed(null, { task, tasksRemaining });
      })
      .catch((e) => {
        console.log("heyLoyaltyController.addMemberToHeyLoyalty ~ e", e);
        // Tilføj task igen til toppen
        heyloyalty.unshift(task);
      });
  }, task.msDelay);
}, 1); // concurrency value = 1
// Executes when the queue is done processing all the items
heyloyalty.drain(() => {
  console.log("Successfully processed all users for Heyloyalty!");
});
/* 
Functions
*/
exports.addUserToMailchimpQueue = (user) => {
  mailchimpQueue.push(user, (error, { task, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${task}`);
    } else {
      console.log(`Finished processing task ${task}. ${tasksRemaining}
                    tasks remaining`);
    }
  });
};
exports.addUserToHeyloyaltyQueue = (user) => {
  heyloyalty.push(user, (error, { task, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${task}`);
    } else {
      console.log(`Finished processing task ${task}. ${tasksRemaining}
                      tasks remaining`);
    }
  });
};
