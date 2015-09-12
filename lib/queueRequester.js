var nconf = require('nconf'),
  path = require('path'),
  amqp = require('amqp'),
  exchange,
  exchangeOptions,
  connection;

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, '..', 'config.json')
});

exchange = nconf.get("rabbit:exchange:name");
exchangeOptions = nconf.get("rabbit:exchange:options");
logLevel = nconf.get("website:logLevel");

connection = amqp.createConnection(nconf.get("rabbit:connection"));

if (logLevel >= 4) {
  console.log("Connecting to RabbitMQ");
}

var connectedExchange;
var exchangeIsOpen = function (ex) {
  if (logLevel >= 4) {
    console.log(ex.name + ' Exchange is open.');
  }
  connectedExchange = ex;
};

connection.once('ready', function() {
  connection.exchange(exchange, exchangeOptions, exchangeIsOpen);
});

connection.once("error", function(err) {
  if (logLevel >= 2) {
    console.log("An error occurred while trying to connect to RabbitMQ!");
    console.log(err);
  }
});

connection.once("end", function() {
  if (logLevel >= 4) {
    console.log("Connection to RabbitMQ has ended.");
  }
});

module.exports = {
  "processCollections": function (username, callback) {
    if (!connectedExchange) {
      if (logLevel >= 2) {
        console.log("Delaying message - RabbitMQ not connected yet.");
      }
      setTimeout(function () {
        this.processCollections(username, callback);
      }, 1000);
    }
    else {
      connectedExchange.publish("processCollections", {
        username: username
      }, {
        contentType: "application/json"
      }, function(e) {
        callback(e);
      });
    }
  },
  "destroy": connection.destroy
};