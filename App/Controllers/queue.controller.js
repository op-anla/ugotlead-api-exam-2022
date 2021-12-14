// Including the async module
const async = require("async");
const mailchimpController = require("./mailchimpController.controller.js");
const heyLoyaltyController = require("./heyLoyaltyController.controller.js");
const emailHelper = require("../common/helpers/emails");
// Initializing the queue
const mailchimpQueue = async.queue((thisTask, executed) => {
  // Number of tasks remaining and to be processed
  const tasksRemaining = mailchimpQueue.length();
  console.log("mailchimpQueue ~ tasksRemaining", tasksRemaining);

  mailchimpController
    .addMemberToMailchimp(thisTask)
    .then((res) => {
      executed(null, { thisTask, tasksRemaining });
    })
    .catch((e) => {
      console.log("heyLoyaltyController.addMemberToMailchimp ~ e", e);
      // Tilføj thisTask igen til toppen
      mailchimpQueue.unshift(thisTask);
    });
}, 10);
// Executes when the queue is done processing all the items
mailchimpQueue.drain(() => {
  console.log("Successfully processed all users for Mailchimp!");
});
// HEYLOYALTY
const heyloyalty = async.queue((thisTask, executed) => {
  // Number of tasks remaining and to be processed
  const tasksRemaining = heyloyalty.length();
  console.log("heyloyalty ~ tasksRemaining", tasksRemaining);

  heyLoyaltyController
    .addMemberToHeyLoyalty(thisTask)
    .then((res) => {
      console.log("heyloyalty member added : ", res);
      executed(null, { thisTask, tasksRemaining });
    })
    .catch((e) => {
      console.log("heyLoyaltyController.addMemberToHeyLoyalty ~ e", e);
      // Tilføj task igen til toppen
      heyloyalty.unshift(thisTask);
    });
}, 10); //Setting concurrent limit to 10 because of limits of public API
// Executes when the queue is done processing all the items
heyloyalty.drain(() => {
  console.log("Successfully processed all users for Heyloyalty!");
});
// EMAIL
const emailQueue = async.queue((thisTask, executed) => {
  // Number of tasks remaining and to be processed
  const tasksRemaining = emailQueue.length();
  console.log("emailQueue ~ tasksRemaining", tasksRemaining);

  // executed(null, { thisTask, tasksRemaining });
  // Stress testing so we comment this
  emailHelper.sendMailThroughMailgun(
    thisTask.from,
    thisTask.to,
    thisTask.subject,
    thisTask.content,
    (err, data) => {
      if (err) {
        console.log("emailQueue ~ err", err);
        throw err;
        // emailQueue.unshift(thisTask);
      } else {
        console.log("We just sent an email!", data);
        executed(null, { thisTask, tasksRemaining });
      }
    }
  );
}, 3); // Setting email concurrent limit to 3
// Executes when the queue is done processing all the items
emailQueue.drain(() => {
  console.log("Successfully processed all emails");
});
/* 
Functions
*/
exports.addUserToMailchimpQueue = (task) => {
  mailchimpQueue.push(task, (error, { thisTask, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${thisTask}`);
    } else {
      console.log(
        `Finished processing task ${thisTask}.mailchimp ${tasksRemaining}`
      );
    }
  });
};
exports.addUserToHeyloyaltyQueue = (task) => {
  heyloyalty.push(task, (error, { thisTask, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${thisTask}`);
    } else {
      console.log(
        `Finished processing task ${thisTask}.heyloyalty ${tasksRemaining} tasks remaining`
      );
    }
  });
};
exports.addEmailToEmailQueue = (task) => {
  emailQueue.push(task, (error, { thisTask, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${thisTask}`);
    } else {
      console.log(
        `Finished processing task ${thisTask}. emails ${tasksRemaining}  tasks remaining`
      );
    }
  });
};
