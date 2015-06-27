var request = require('request');
var validator = require('validator');
var webshot = require('webshot');
var easyimg = require('easyimage');
var gm = require('gm').subClass({ imageMagick: true });

var nodecr = require('nodecr');

var validProtocols = {
  'http': 'true',
  'https': 'true'
}

module.exports = {
  getScreenshot: function(url, userId, cb) {

    console.log('userId in getscreenshot ' + userId);

    var urlWithoutHTTP = url.substring(url.indexOf("://") + 3)  // handle http AND https protocols
    urlWithoutHTTP = urlWithoutHTTP.replace(/[?/.=]/g, '_');    // change weird characters to underscore

    webshot(url, '../client/assets/' + userId + '/' + urlWithoutHTTP + '-preview.png', function(err) {
      // screenshot now saved to google.png// screenshot now saved to hello_world.png
      cb('assets/' + userId + '/' + urlWithoutHTTP + '-preview.png');
    });
  },

  cropImg: function(url, crop, compare, cb) {

    var filepath = url.substr(0, url.length - 12) + ((compare) ? '-compare.png' : '.png');

     gm('../client/' + url).crop(crop.w, crop.h, crop.x, crop.y)
      .write('../client/' + filepath, function(err){
        if (err) return console.dir(arguments)
        cb(filepath, crop);
      });

  },

  imagetotext: function(img, cb) {
    // image filtering
    var current = '../client/'+img;
    var filteredImg = "../client/"+img.slice(0,img.length-4)+".tiff";

   var imgFil = gm(current).type('grayscale').enhance().unsharp(6.8, 1.0, 2.69, 0).resize(1200,2000).write(filteredImg, function (err) {
  // ...
    }); 

    console.log('filteredImg',filteredImg);
    //nodecr.process('../client/assets/1/www_amazon_com_Down-Rabbit-Hole-Adventures-Cautionary_dp_0062372106_ref_zg_bsnr_books_2.jpg',function(err, text) {
    nodecr.process(filteredImg, function(err, text) {
        if(err) {
            console.error(err);
        } else {
            console.log('text from tesseract', text);
            cb(text);
        }
    });
  }

};
