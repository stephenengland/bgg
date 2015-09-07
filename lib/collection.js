var mongoose = require('mongoose');

module.exports = mongoose.model("Collection", {
  "username": String,
  "data": String
});