var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    id           : String,
    token        : String,
    email        : String,
    name         : String
});

module.exports = mongoose.model('user', userSchema);