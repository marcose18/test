var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var crypto = require('crypto');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var passport = require('passport');
require('../config/passport')(passport);
var port = process.env.PORT || 8080;        // set our port
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var project = require('./models/project');
var builder = require('./models/builder');
var city = require('./models/city');
var user = require('./models/user');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
app.set('views', '../views');
app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret : 'aasjksadbjh'}));
app.use(passport.initialize());
app.use(passport.session());

//app.use(passport.initialize());
/*router.use(function(req, res, next){
	var time = (new Date()).getTime() / 1000;
	//console.log(time);
	if(time - 3000 > req.query.timestamp)
		res.status(401).send('Something Went Wrong! Please Try Again1');
	var name = req.query.timestamp + 'saltstring' + 'http://localhost:8080/insert';
	//console.log(req.query.timestamp);
	var hash = crypto.createHash ('md5').update(name).digest('hex');
	//console.log(req.query.signature + " " + hash); 
	if(req.query.signature != hash)
		res.status(401).send('Something Went Wrong! Please Try Again');
	//console.log('Approved');
	next();
});
*/
router.get('/', function(req, res) {
        res.render('index.ejs');
    });

router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
router.get('/search', function(req, res, next) {
       if(req.query.entity == 'user')
		user.find({'id' : {$regex : '.*' + req.query.id + '.*'}}, function(err, user){
			if(err)
				res.status(404).send('Something Went Wrong');
				res.json(user);
	});
	if(req.query.entity == 'project')
		project.find({'name' : {$regex : '.*' + req.query.name + '.*'}}, function(err, project){
			if(err)
				res.status(404).send('Something Went Wrong');
				res.json(project);
	});
	if(req.query.entity == 'builder')
		builder.find({'name' : {$regex : '.*' + req.query.name + '.*'}}, function(err, builder){
			if(err)
				res.status(404).send('Something Went Wrong');
				res.json(builder);				
	});
	if(req.query.entity == 'city')
		city.find({'name' : {$regex : '.*' + req.query.name + '.*'}}, function(err, city){
			if(err)	
				res.status(404).send('Something Went Wrong');
				res.json(city);				
	});
});
router.get('/insert', function(req, res, next){
	if(req.query.entity == 'user'){
		var newuser = new user();
		newuser.id = req.query.id;
		newuser.token = req.query.token;
		newuser.email = req.query.email;
		newuser.name = req.query.name;
		newuser.save(function(err){
			if(err)
				res.send('Something Went Wrong');
			res.send('User Inserted');
		});
	}
	if(req.query.entity == 'builder'){
		var newbuilder = new builder();
		newbuilder.est = req.query.est;
		newbuilder.id = req.query.id;
		newbuilder.address = req.query.address;
		newbuilder.contact.email = req.query.email;
		newbuilder.contact.number = req.query.number;
		newbuilder.name = req.query.name;
		builder.find({'name' : req.query.name}, function(err, builder){
			if(err)
				res.send(err);
			if(builder.length > 0)
				res.send('builder already exists');
			newbuilder.save(function(err){
			if(err)
				res.send('Something Went Wrong');
			res.send('builder inserted');
		});           
		});
	}
	if(req.query.entity == 'city'){
		var newcity = new city();
		newcity.id = req.query.id;
		newcity.name = req.query.name;
		city.find({'name' : req.query.name}, function(err, city){
		//	console.log(city.length);
			if(city.length > 0)
				res.send('City already exists');
				return;
			if(err)
				res.send(err);
			newcity.save(function(err){
			if(err)
				res.send('Something Went Wrong');
			res.send('city inserted');
		});
		});
	}
	if(req.query.entity == 'project'){
		var newproject = new project();
		newproject.id = req.query.id;
		newproject.name = req.query.name;
		newproject.location = req.query.location;
		newproject.type = req.query.type;
		newproject.area = req.query.area;
		newproject.priceRange = req.query.priceRange;
		newproject.BuilderId = newproject.BuilderId;
		newproject.typeOfFlat = newproject.typeOfFlat;
		newproject.cityId = newproject.cityId;
		project.find({'name' : req.query.name}, function(err, project){
			if(err)
				res.send('Something went wrong');
			if(project.length > 0)
				res.send('project already exists');
			newproject.save(function(err){
			if(err)
				res.send('Something Went Wrong');
			res.send('project inserted');
		});
		});
	}
});
router.get('/searchall', function(req, res){

		var ans = [];
		var temp_city = [];

			city.find({'name' : {$regex : '.*' + req.query.querystr + '.*'}}, function(err, city){
				if(err)
					res.send(err);
			//	console.log('city' + " " + city.length);
			//	console.log(Math.min(5, city.length));
				for(i = 0;i < Math.min(5, city.length);i++){
					temp_city.push({'id' : city[i].id,
									'name' : city[i].name});
					//console.log(i);
				}
				ans.push(temp_city);
			//	console.log('temp_City' + " " + ans);
			

			builder.find({'name' : {$regex : '.*' + req.query.querystr + '.*'}}, function(err, builder){
			temp_city = [];
				if(err)
					res.send(err);

				for(i = 0;i < Math.min(5, builder.length);i++){
					temp_city.push({'id' : builder[i].id,
											'name' : builder[i].name});
				}
			//	console.log('temp_city' + " " + ans.length);
				ans.push(temp_city);


			project.find({'name' : {$regex : '.*' + req.query.querystr + '.*'}}, function(err, project){
			temp_city = [];
				if(err)
					res.send(err);
				for(i = 0;i < Math.min(5, project.length);i++){
					temp_city.push({'id' : project[i].id,
												'name' : project[i].name});
				}
			//	console.log('temp_city' + " " + ans.length);
				ans.push(temp_city);
				res.send(ans);
			});
		});
	});
			//console.log(temp_city);
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


