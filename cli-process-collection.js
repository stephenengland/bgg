var nconf = require('nconf'),
    amqp = require('amqp'),
    exchange,
    exchangeOptions,
    connection;

nconf.argv().env();
nconf.file({
    file: './config.json'
});

exchange = nconf.get("rabbit:exchange:name");
exchangeOptions = nconf.get("rabbit:exchange:options");
logLevel = nconf.get("logLevel");

connection = amqp.createConnection(nconf.get("rabbit:connection"));

if (logLevel >= 4) {
    console.log("Connecting to RabbitMQ");
}

connection.once('ready', function () {
    connection.exchange(exchange, exchangeOptions, function (ex) {
        if (logLevel >= 4) {
            console.log(ex.name + ' Exchange is open.');
        }
        ex.publish("processCollections", {
            username: "nitroscen"
          }, {
            contentType: "application/json"
          }, function (e) {
            console.log(e);
        })
        connection.destroy();
    });
});

connection.once("error", function (err) {
    if (logLevel >= 2) {
        console.log("An error occurred while trying to connect!");
        console.log(err);
    }
});

connection.once("end", function () {
    if (logLevel >= 4) {
        console.log("Connection to RabbitMQ has ended.");
    }
});