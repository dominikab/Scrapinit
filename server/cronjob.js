var basicScraper = require('./controllers/basicScraperController');
var getExternalUrl = require('./controllers/urlController').getExternalUrl;
var CronJob = require('cron').CronJob;
var secret = require('../config.js');
var db = require('./db.js');
var Sequelize = require('sequelize');
var mandrill = require('mandrill-api');
var resemble = require('resemblejs')
mandrill_client = new mandrill.Mandrill(secret.mandrill.client_id);

// To run the cronjob as it is now: navigate to server dir and type node cronjob
// for every five minutes
// var schedule = '* +' */5 * * * *';


// for faster testing
// var schedule = '*/30 * * * * *';
var schedule = '*/5 * * * * *';

//To run every 3 seconds do */3; every 5 min do * */5 *

var cronjob = new CronJob(schedule, function() {
  console.log('You will see this message every 5 min');
  // check database for jobs assigned for cronjob

  // get urls 
  db.User.findAll()
  .then(function(allUsers) {
    for (var i = 0; i < allUsers.length; i++){
      var currEmail = allUsers[i].email;
      console.log('email', currEmail)
      allUsers[i].getUrls()
      .then(function(url) {
        console.log('in the for loop')
        for (var j=0; j<url.length; j++){
           console.log('url', url[j].UserUrl.cropImage)
           // console.log('url', url[j].id)
           
           var img1 = url[j].UserUrl.cropImage;
           var params = {
            h: url[j].UserUrl.cropHeight,
            w: url[j].UserUrl.cropWidth,
            x: url[j].UserUrl.cropOriginX,
            y: url[j].UserUrl.cropOriginY
           }
        // get the server to render the page with params coordinates
        basicScraper.getScreenshot(url[j].url, url[j].id, function(urlToThePage) {
          console.log('url to the page', urlToThePage)
          basicScraper.cropImg(urlToThePage, params, function() {console.log()}, true);
        })
        //

        }
       
            // display html that are changed

            for (var i = 0; i < url.length; i++) {
              getExternalUrl(url[i], function(newImage, url) {
                if (url) {
                  // the old image value that is stored
                  var oldImage = url.UserUrl.cropImage;

                  // Compare images here
                  // if (!(oldHtml === newHtml)) {
                  //   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
                  //   console.log('there is a change at', url.url,'!')

                  //   // send email
                  //   // sendEmail(currEmail, currEmail);


                  //   // update html value in database


                  // }
                }
              });
              
            }
          })
}
})


               var compare = function (img1, img2){
               //  var diff = resemble(img1).compareTo(img2).ignoreColors().onComplete(function(data){
               //  console.log(data);
               //  });
              }

              var img1 = '../client/assets/qvNot4g0dBZNio45GtwpXfopy8poLxm8/google.com.jpg';
              var img2 = '../client/assets/qvNot4g0dBZNio45GtwpXfopy8poLxm8/google.com.jpg';
              compare(img1,img2);

                    // send email
                    // sendEmail(currEmail, currEmail);
                    // update html value in database                    } 
            });
        };
      });

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