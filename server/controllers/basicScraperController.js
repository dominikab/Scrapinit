var request = require('request');
var validator = require('validator');
var easyimg = require('easyimage');
var gm = require('gm').subClass({ imageMagick: true });

var utils = require('../utils/scrape.js');

var validProtocols = {
  'http': 'true',
  'https': 'true'
}

module.exports = {
  getScreenshot: function(url, userId, cb, email) {

    var urlWithoutHTTP = url.substring(url.indexOf("://") + 3)  // handle http AND https protocols
    var namePreview = '';
    urlWithoutHTTP = urlWithoutHTTP.replace(/[?/.=]/g, '_');    // change weird characters to underscore

    namePreview = urlWithoutHTTP + '-preview.png'
    utils.scrapeFullImage(url, namePreview, userId, function (err, path) {
      console.log('err', err);
      if (err === 'success') {
        cb(path, email);

      } else {
        cb(err);
      }
    });
    // webshot(url, '../client/assets/' + userId + '/' + urlWithoutHTTP + '-preview.jpg', function(err) {
    //   // screenshot now saved to google.png// screenshot now saved to hello_world.png
    //   cb('assets/' + userId + '/' + urlWithoutHTTP + '-preview.jpg');
    // });
  },

  cropImg: function(url, crop, compare, cb, email) {

    console.log('url corpimg', url);

    var filepath = url.substr(0, url.length - 12) + ((compare) ? '-compare.png' : '.png');
    console.log('cropimg ', filepath)
     gm('../client/' + url).crop(crop.w, crop.h, crop.x, crop.y)
      .write('../client/' + filepath, function(err){
        if (err) return console.dir(arguments)
        cb(filepath, crop, email);
      });

  }

};
