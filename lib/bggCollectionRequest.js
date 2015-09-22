var nconf = require('nconf'),
  path = require('path'),
  request = require('request'),
  parseXml = new require('xml2js').Parser(),
  bggCollectionParser = require('./bggCollectionParser'),
  mongoose = require('mongoose'),
  Collection = require('./collection');

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, '..', 'config.json')
});

var bggCollectionRequestDelay = nconf.get("bgg:collectionRequestDelay") || 2000;

mongoose.connect(nconf.get("mongoConnection"));

var storeCollection = function(result, username, callback) {
  Collection.find({
    "username": username
  }, function(err, foundCollection) {
    var found = !err && foundCollection && foundCollection.length > 0;
    if (err) {
      console.log("lib/bggCollectionRequest.js | " + err);
    }

    var col;
    if (found) {
      col = foundCollection[0];
      col.data = JSON.stringify(result);
      col.lastProcessed = Date.now();
    } else {
      col = new Collection({
        "username": username,
        "data": JSON.stringify(result)
      });
    }

    col.save(function(err2) {
      if (err2) {
        console.log("lib/bggCollectionRequest.js | " + err2);
      }
      callback();
    });
  });
};

var parseResult = function(result, username, callback) {
  parseXml.parseString(result, function(err, parsedResult) {
    if (err) {
      console.log("lib/bggCollectionRequest.js | " + err);
      callback();
    } else {
      var bggCollectionParsed = bggCollectionParser.parseResults(JSON.parse(JSON.stringify(parsedResult)));
      storeCollection(bggCollectionParsed, username, callback);
    }
  });
};

var tryCollectionRequest = function(username, callback) {
  request('http://www.boardgamegeek.com/xmlapi2/collection?username=' + username + '&own=1&stats=1', function(error, response, body) {
    var completedSuccessfully = !error && response && response.statusCode === 200;
    var tryBackLater = !error && response && response.statusCode === 202;

    if (completedSuccessfully) {
      parseResult(body, username, function() {
        callback(completedSuccessfully, false);
      });
    } else {
      callback(completedSuccessfully, tryBackLater);
    }
  });
};

module.exports = {
  "makeRequest": function(username, finishedCallback) {
    tryCollectionRequest(username, function(completedSuccessfully, tryBackLater) {
      if (tryBackLater) {
        setTimeout(function () {
          tryCollectionRequest(username, finishedCallback);
        }, bggCollectionRequestDelay);
      } else {
        finishedCallback();
      }
    });
  }
};
