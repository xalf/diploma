var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
	name: {type: String, unique:true, required: true},
	email: {type: String, unique:true, required: true},
	hash: String,
	salt: String,
	type: {type: String, required: true}
});

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000,64).toString('hex');
	return hash === this.hash;
};

userSchema.methods.generateJwt = function(){
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		type: this.type,
		exp: parseInt(expiry.getTime() / 1000)
	}, process.env.JWT_SECRET);
};

var clientRoleSchema = new mongoose.Schema({
	img: String,
	userid: {type: String, required: true}
});

var adminRoleSchema = new mongoose.Schema({
	userid: {type: String, required: true},
	cafeid: {type: String, "default": ""}
});

mongoose.model('User', userSchema, 'users');
mongoose.model('Admin', adminRoleSchema, 'admins');
mongoose.model('Client', clientRoleSchema, 'clients');