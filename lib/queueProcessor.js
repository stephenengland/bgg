var nconf = require('nconf'),
  path = require('path'),
  amqp = require('amqp'),
  exchange,
  exchangeOptions,
  queue,
  queueOptions,
  vhost,
  connection;

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, '..', 'config.json')
});

exchange = nconf.get("rabbit:exchange:name");
exchangeOptions = nconf.get("rabbit:exchange:options");
queue = nconf.get("rabbit:queue:name");
queueOptions = nconf.get("rabbit:queue:options");
vhost = nconf.get("rabbit:vhost");
logLevel = nconf.get("logLevel");
messageThreads = nconf.get("rabbit:messageThreads") || 1;

module.exports = function(routingKey, messageCallback) {
  connection = amqp.createConnection(nconf.get("rabbit:connection"));

  if (logLevel >= 4) {
    console.log("lib/queueProcessor.js | Connecting to RabbitMQ");
  }

  connection.on('ready', function() {
    connection.exchange(exchange, exchangeOptions, function(ex) {
      if (logLevel >= 4) {
        console.log("lib/queueProcessor.js | " + ex.name + ' Exchange is open.');
      }
    });

    connection.queue(queue, queueOptions, function(q) {
      if (logLevel >= 4) {
        console.log("lib/queueProcessor.js | Connected to " + q.name + " queue.");
      }
      q.bind(exchange, routingKey);
      q.subscribe({
        "ack": true,
        "prefetchCount": messageThreads
      }, function(message, headers, deliveryInfo, messageObject) {
        try {
          if (logLevel >= 3) {
            console.log("lib/queueProcessor.js | Message:");
            console.log(message);
          }
          messageCallback(message, function() {
            setTimeout(function() {
              messageObject.acknowledge(false);
            }, 1000);
          });
        } catch (err) {
          if (logLevel >= 2) {
            console.log("lib/queueProcessor.js | Error while reading message");
            console.log("lib/queueProcessor.js | " + new Date());
            console.log("lib/queueProcessor.js | " + message);
            console.log("lib/queueProcessor.js | " + err);
          }
        }
      });
    });
  });

  connection.on("error", function(err) {
    if (logLevel >= 2) {
      console.log("lib/queueProcessor.js | An error occurred while trying to connect!");
      console.log(err);
    }
    connection.destroy();
  });

  connection.on("end", function() {
    if (logLevel >= 4) {
      console.log("lib/queueProcessor.js | Connection to RabbitMQ has ended.");
    }
  });
};
