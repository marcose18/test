var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    id: String,
    name: String,
	location: String,
	type: String,
	area: String,
	typeOfFlat: String,
	priceRange: String,
	BuilderId: String,
	cityId: String
});

module.exports = mongoose.model('project', userSchema);