var nconf = require('nconf'),
  path = require('path'),
  mongoose = require('mongoose');

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, '..', 'config.json')
});

var schema = mongoose.Schema({
  "username": String,
  "data": String,
  "lastProcessed": {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Collection", schema);
