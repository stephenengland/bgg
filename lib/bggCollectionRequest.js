var request = require('request'),
    parseXml = new require('xml2js').Parser(),
    bggCollectionParser = require('./bggCollectionParser'),
    mongoose = require('mongoose'),
    Collection = require('./collection');

mongoose.connect('mongodb://localhost/bgg');

var storeCollection = function (result, username, callback) {
  Collection.find({ "username": username }, function (err, foundCollection) {
    var found = !err && foundCollection && foundCollection.length > 0;
    if (err) {
      console.log(err)
    }

    var col;
    if (found) {
      col = foundCollection[0];
    }
    else {
      col = new Collection({
        "username": username,
        "data": JSON.stringify(result)
      });
    }

    col.save(function (err2) {
      if (err2) {
        console.log(err2);
      }
      callback();
    });
  });
};

var parseResult = function (result, username, callback) {
  parseXml.parseString(result, function (err, parsedResult) {
    if (err) {
      console.log(err)
      callback();
    }
    else {
      var bggCollectionParsed = bggCollectionParser.parseResults(JSON.parse(JSON.stringify(parsedResult)));
      storeCollection(bggCollectionParsed, username, callback);
    }
  });
};

var tryCollectionRequest = function (username, callback) {
  request('http://www.boardgamegeek.com/xmlapi2/collection?username=' + username + '&own=1', function (error, response, body) {
    var completedSuccessfully = !error && response && response.statusCode === 200;
    var tryBackLater = !error && response && response.statusCode === 202;

    if (completedSuccessfully) {
      parseResult(body, username, function () {
        callback(completedSuccessfully, false);
      });
    }
    else {
      callback(completedSuccessfully, tryBackLater);
    }
  });
};

module.exports = {
  "makeRequest": function (username, finishedCallback) {
    tryCollectionRequest(username, function (completedSuccessfully, tryBackLater) {
      if (tryBackLater) {
        setTimeout(tryCollectionRequest, 2000);
      }
      else {
        finishedCallback();
      }
    });
  }
};