var CronJob = require('cron').CronJob;
var secret = require('../config.js');
var db = require('./db.js');
var mandrill = require('mandrill-api');
var Sequelize = require('sequelize');
mandrill_client = new mandrill.Mandrill(secret.mandrill.client_id);

// To run the cronjob as it is now: navigate to server dir and type node cronjob
var schedule = '* * * * * *';
//var schedule = '0 */5 * * * *';
//To run every 3 seconds do */3; every 5 min do * */5 *

var cronjob = new CronJob(schedule, function() {
  console.log('You will see this message every 5 min');
  // check database for jobs assigned for cronjob
  // access all the users in the database
   db.User.findAll().then(function(userObj) {
        for (var i=0; i<userObj.length; i++){
       // output all the emails   
       // console.log("email at ", i," is: ", userObj[i].email)
      }
      })
    // db.User.findOne({where: {email: '1@1.com'}})
    //   .then(function(userObj) {
    //     console.log(userObj.email)
    //   })
    db.Url.insert('1@1.com','google.com')
    db.Url.findAll().then(function(allUrls){
      console.log('urls',allUrls)
        // for (var i=0; i<allUrls.length; i++){
        //   console.log('URLS',allUrl)
        // }

  //db.Url.insert({user:'1@1.com', url:'google.com'})
 
  var changed = false;
  if (changed) {
    sendEmail('', '');
    changed = false;
  }


}, null, true, 'America/Los_Angeles');

var sendEmail = function (email, name){
  var message = {
    "html": "<span>The Scrapinit found a change in the webpage you are following</span>",
    "subject": "We scraped some tubular stuff for you!!",
    "from_email": email,
    "from_name": "The Blank Arrays",
    "to": [{
      "email": email,
      "name":  name,
      "type": "to"
    },
    ],
    "headers": {
      "Reply-To": ""
    },
    "important": true,
  };

var async = false;
//send email // uncomment to send an email
mandrill_client.messages.send({"message": message, "async": async}, function(result) {
  console.log('Sent a message to '+ email+'  '+ result);
}, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
}