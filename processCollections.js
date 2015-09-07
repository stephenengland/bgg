var QueueProcessor = require('./lib/queueProcessor');

var processor = QueueProcessor("processCollections", function (message, callback) {
  console.log(message);
  setTimeout(function () {
    callback();
  }, 5000);
});