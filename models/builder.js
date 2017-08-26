var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	est: String,
    id: String,
    address: String,
    contact: {number: String, email: String},
    name: String
});

module.exports = mongoose.model('builder', userSchema);
