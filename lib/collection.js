var nconf = require('nconf'),
  path = require('path'),
  mongoose = require('mongoose');

nconf.argv().env();
nconf.file({
  file: path.join(__dirname, '..', 'config.json')
});

var expireDays = nconf.get("collectionExpirationDays");

module.exports = mongoose.model("Collection", {
  "username": String,
  "data": String,
  "lastProcessed": {
    type: Date,
    expires: 60 * 60 * 24 * expireDays
  }
});
