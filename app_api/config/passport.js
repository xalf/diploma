var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new localStrategy({
	usernameField: 'email'
}, function(username, password, done){
	User.findOne(
		{email: username}, 
		function(err,user){
			if(err)
				return done(err);
			if(!user)
				return done(null, false, {
					message: "Неверное имя"
				});
			if(!user.validPassword(password))
				return done(null, false, {
					message: "Неверный пароль"
				});
			return done(null, user);
		});
}));