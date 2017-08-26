var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    id           : String,
    name         : String
});

module.exports = mongoose.model('city', userSchema);