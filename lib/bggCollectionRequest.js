var request = require('request'),
    parseXml = new require('xml2js').Parser(),
    bggCollectionParser = require('./bggCollectionParser');

var parseResult = function (result, callback) {
  parseXml.parseString(result, function (err, parsedResult) {
    if (err) {
      console.log(err)
    }
    else {
      var bggCollectionParsed = bggCollectionParser.parseResults(JSON.parse(JSON.stringify(parsedResult)));
      console.log(bggCollectionParsed);
    }
    callback();
  });
};

var tryCollectionRequest = function (username, callback) {
  request('http://www.boardgamegeek.com/xmlapi2/collection?username=' + username + '&own=1', function (error, response, body) {
    var completedSuccessfully = !error && response && response.statusCode === 200;
    var tryBackLater = !error && response && response.statusCode === 202;

    if (completedSuccessfully) {
      parseResult(body, function () {
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