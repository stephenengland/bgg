var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    compression = require('compression'),
    nconf = require('nconf'),
    path = require('path'),
    collectionController = require(path.join(__dirname, 'controllers', 'collection')),
    mongoose = require('mongoose');

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, 'config.json')
});

app.use(compression());

mongoose.connect(nconf.get('mongoConnection'));

mongoose.connection.on('error', console.error.bind(console, 'Mongoose Connection Error:'));
mongoose.connection.once('open', function (callback) {
  console.log('server.js | Mongoose Connection open.');
  server.listen(nconf.get('website:port'), function () {
    console.log('server.js | Listening on port ' + nconf.get('website:port'));
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

collectionController(app);

app.use(express.static(path.join(__dirname, 'www'), {}));

//Fallback - this is for HTML 5 push state routing, used by the client side app (angularjs)
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});