var QueueProcessor = require('./lib/queueProcessor'),
    bggCollectionRequest = require('./lib/bggCollectionRequest');

var processor = QueueProcessor("processCollections", function (message, callback) {
  bggCollectionRequest.makeRequest(message.username, callback);
});