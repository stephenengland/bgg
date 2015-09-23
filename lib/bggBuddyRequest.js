var nconf = require('nconf'),
  path = require('path'),
  request = require('request'),
  parseXml = new require('xml2js').Parser(),
  bggCollectionParser = require('./bggBuddyParser'),
  mongoose = require('mongoose'),
  Collection = require('./collection');

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, '..', 'config.json')
});

var tryBuddyRequest = function(username, callback) {
	request('http://www.boardgamegeek.com/xmlapi2/user?name=' + username +'&buddies=1' funcction(error, response, body) {
		var completedSuccessfully = !error && response && response.statusCode === 200;
		var tryBackLater = !error && response && response. statusCode === 200;

		if (completedSuccessfully) {
			parseResults(body, username, function() {
				callback(completedSuccessfully, false);
			});
		} else {
			callback(completedSuccessfully, tryBackLater);
		}
	});
};

module.exports = {
  "makeRequest": function(username, finishedCallback) {
    tryBuddyRequest(username, function(completedSuccessfully, tryBackLater) {
      if (tryBackLater) {
        setTimeout(function () {
          tryBuddyRequest(username, finishedCallback);
        }, bggCollectionRequestDelay);
      } else {
        finishedCallback();
      }
    });
  }
};