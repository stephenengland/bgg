var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    compression = require('compression'),
    nconf = require('nconf'),
    path = require('path'),
    queueRequester = require(path.join(__dirname, 'lib', 'queueRequester'));

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, 'config.json')
});

app.use(compression());

server.listen(nconf.get('website:port'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.get('/collection/:username', function (req, res) {
  if (req.params.username && req.params.username.length > 2) {
    queueRequester.processCollections(req.params.username, function (errorOccurred) {
      if (errorOccurred) {
        console.log("Error sending message for processing collection:" + req.params.username);
        res.status(200);
      }
      else {
        res.status(503);
      }
      res.send({ "username": req.params.username }).end();
    });
  }
  else {
    res.status(500).send({"message": "Invalid response!"}).end();
  }
});

app.use(express.static(path.join(__dirname, 'www'), {}));