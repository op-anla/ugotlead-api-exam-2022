// Including the async module
const async = require("async");
const mailchimpController = require("./mailchimpController.controller.js");
const heyLoyaltyController = require("./heyLoyaltyController.controller.js");
const emailHelper = require("../common/helpers/emails");
// Initializing the queue
const mailchimpQueue = async.queue((userTask, executed) => {
  // Number of tasks remaining and to be processed
  const tasksRemaining = mailchimpQueue.length();
  console.log("mailchimpQueue ~ tasksRemaining", tasksRemaining);

  mailchimpController
    .addMemberToMailchimp(userTask)
    .then((res) => {
      executed(null, { userTask, tasksRemaining });
    })
    .catch((e) => {
      console.log("heyLoyaltyController.addMemberToMailchimp ~ e", e);
      // Tilføj userTask igen til toppen
      mailchimpQueue.unshift(userTask);
    });
}, 10);
// Executes when the queue is done processing all the items
mailchimpQueue.drain(() => {
  console.log("Successfully processed all users for Mailchimp!");
});
// HEYLOYALTY
const heyloyalty = async.queue((userTask, executed) => {
  // Number of tasks remaining and to be processed
  const tasksRemaining = heyloyalty.length();
  console.log("heyloyalty ~ tasksRemaining", tasksRemaining);

  heyLoyaltyController
    .addMemberToHeyLoyalty(userTask)
    .then((res) => {
      console.log("heyloyalty member added : ", res);
      executed(null, { userTask, tasksRemaining });
    })
    .catch((e) => {
      console.log("heyLoyaltyController.addMemberToHeyLoyalty ~ e", e);
      // Tilføj task igen til toppen
      heyloyalty.unshift(userTask);
    });
}, 10); //Setting concurrent limit to 10 because of limits of public API
// Executes when the queue is done processing all the items
heyloyalty.drain(() => {
  console.log("Successfully processed all users for Heyloyalty!");
});
// EMAIL
const emailQueue = async.queue((emailTask, executed) => {
  // Number of tasks remaining and to be processed
  const tasksRemaining = emailQueue.length();
  console.log("emailQueue ~ tasksRemaining", tasksRemaining);

  executed(null, { emailTask, tasksRemaining });
  //Stress testing so we comment this
  // emailHelper.sendMail(
  //   emailTask.from,
  //   emailTask.to,
  //   emailTask.subject,
  //   emailTask.content,
  //   (err, data) => {
  //     if (err) {
  //       console.log("emailQueue ~ err", err);
  //       emailQueue.unshift(emailTask);
  //     } else {
  //       console.log("We just sent an email!", data);
  //       executed(null, { emailTask, tasksRemaining });
  //     }
  //   }
  // );
}, 3); // Setting email concurrent limit to 3
// Executes when the queue is done processing all the items
emailQueue.drain(() => {
  console.log("Successfully processed all emails");
});
/* 
Functions
*/
exports.addUserToMailchimpQueue = (task) => {
  mailchimpQueue.push(task, (error, { task, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${task}`);
    } else {
      console.log(`Finished processing task ${task}.mailchimp`);
    }
  });
};
exports.addUserToHeyloyaltyQueue = (task) => {
  heyloyalty.push(task, (error, { task, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${task}`);
    } else {
      console.log(`Finished processing task ${task}.heyloyalty ${tasksRemaining}
                      tasks remaining`);
    }
  });
};
exports.addEmailToEmailQueue = (task) => {
  emailQueue.push(task, (error, { task, tasksRemaining }) => {
    if (error) {
      console.log(`An error occurred while processing task ${task}`);
    } else {
      console.log(`Finished processing task ${task}. emails ${tasksRemaining}
                        tasks remaining`);
    }
  });
};
