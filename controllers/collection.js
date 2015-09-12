var path = require('path'),
    nconf = require('nconf'),
    queueRequester = require(path.join(__dirname, '..', 'lib', 'queueRequester')),
    Collection = require(path.join(__dirname, '..', 'lib', 'collection'));


var collectionMissingDataRetry = nconf.get("bgg:missingDataRetry") || 6000;
var collectionStaleDataTimeout = nconf.get("bgg:collectionStaleDataTimeout") || (1000 * 60 * 60);


var respondWithCollection = function (res, collection) {
  var lastProcessedDifference = Date.now() - collection.lastProcessed;
  res.send({ 
    "username": collection.username,
    "collection": JSON.parse(collection.data),
    "processing": !collection.data || (collection.lastProcessedDifference > collectionStaleDataTimeout)
  }).end();
};

var newCollection = function (req, res, username) {
  var col = new Collection({
    "username": username,
    "data": null
  });

  col.save(function (err) {
    if (err) {
      console.log("controllers/collection.js | Error saving collection in Mongoose! Username:" + username);
      res.status(503).end();
      return;
    }
    queueRequester.processCollections(username, function (errorOccurred) {
      if (errorOccurred) {
        console.log("controllers/collection.js | Error sending message for processing collection:" + username);
        res.status(503);
      }
      else {
        res.status(200);
      }
      respondWithCollection(res, col);
    });
  });
};

module.exports = function (app) {
  app.get('/collection/:username', function (req, res) {
    var username = req.params.username;
    if (username && username.length > 2) {

      Collection.findOne({
        "username": req.params.username
      }, function (err, collection) {
        if (err) {
          console.log("controllers/collection.js | Error during collection find!");
          res.status(503).send({"message": "A server error occurred!"}).end();
          return;
        }

        if (!collection) {
          newCollection(req, res, username);
        }
        else {
          var lastProcessedDifference = Date.now() - collection.lastProcessed;

          //Data is stale - reprocess
          if (lastProcessedDifference >= collectionStaleDataTimeout) {
            queueRequester.processCollections(username, function (errorOccurred) {
              if (errorOccurred) {
                console.log("controllers/collection.js | Error sending message for processing collection:" + username);
                res.status(503);
              }
              else {
                res.status(200);
              }
              respondWithCollection(res, collection);
            }); 
          }
          //Data should have been processed by now. Requeue the message.
          else if (lastProcessedDifference > collectionMissingDataRetry && !collection.data) {
            queueRequester.processCollections(username, function (errorOccurred) {
              if (errorOccurred) {
                console.log("controllers/collection.js | Error sending message for processing collection:" + username);
                res.status(503);
              }
              else {
                res.status(200);
              }
              respondWithCollection(res, collection);
            });
          }
          //Data isn't stale, but it could still be processing (collection.data == undefined)
          else {
            res.status(200);
            respondWithCollection(res, collection);
          }
        }
      });
    }
    else {
      res.status(500).send({"message": "Invalid response!"}).end();
    }
  });
};