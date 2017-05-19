var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Client = mongoose.model('Client');
var Admin = mongoose.model('Admin');
var saveImg = require('../saveImg');

module.exports.register = function(req, res){
	if(!req.body.name || !req.body.email || !req.body.password || !req.body.type){
		sendJsonResponse(res, 404, {
			message: "Все поля обязательны"
		});
		return;
	}
	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	user.type = req.body.type;
	user.setPassword(req.body.password);
	
	user.save(function(err){
		var token;
		if(err){
			sendJsonResponse(res, 404, err);
		} else {
			token = user.generateJwt();
			var id = user._id.toString();
			var saveType = function(err){
				if(err)
					sendJsonResponse(res, 404, err);
				else 
					sendJsonResponse(res, 200, {
						'token': token
					});
			};
			if(req.body.type === 'client'){
				console.log("client");
				console.log(typeof user._id);
				var client = new Client();
				client.userid = user._id;
				console.log(typeof client.userid);
				client.save(saveType);
			}
			if(req.body.type === 'admin'){
				/*console.log("admin");
				console.log(user._id);
				var admin = new Admin();
				admin.userid = user._id;
				console.log(admin.userid);
				console.log(admin);
				admin.save(saveType);*/
				var obj = {
					userid: id,
					cafeid: ""
				};
				Admin.create(obj,function(err, admin){
					if(err)
					sendJsonResponse(res, 404, err);
				else 
					sendJsonResponse(res, 200, {
						'token': token
					});
				});	
			}
			
		}
	});
};

module.exports.login = function(req, res){
	if(!req.body.email || !req.body.password || !req.body.type){
		sendJsonResponse(res, 404, {
			message: "Все поля обязательны"
		});
		return;
	}
	
	passport.authenticate('local', function(err, user, info){
		var token;
		if(err){
			sendJsonResponse(res, 404, err);
		}
		if(user) {
			token = user.generateJwt();
			sendJsonResponse(res, 200, {
				'token': token
			});
		} else {
			sendJsonResponse(res,404,info);
		}
	})(req, res);
};

module.exports.clientInfo = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'client'){
		User
			.findOne({email:req.payload.email})
			.exec(function(err, user){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					Client
						.findOne({userid:user._id})
						.exec(function(err, client){
							if(err){
								sendJsonResponse(res, 404, err);
								return;
							} else {
								sendJsonResponse(res, 200, {
									img: client.img
								});
								return;
							}
					});
				}
			});
		
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
};

module.exports.updateClient = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'client'){
		Client
			.findOne({userid: req.payload._id})
			.exec(function(err, client){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					// код изменений
					saveImg(req, function(uploadFile){
						var newLink = uploadFile.path.substr(9);
						client.img = newLink;

						client.save(function(err){
							if(err)
								sendJsonResponse(res, 404, err);
							else{
								sendJsonResponse(res, 200, {
									img: newLink
								});
							}
						});
					});
							
				}
					
		});
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
}

module.exports.deleteUser = function(req, res){
	if(req.payload && req.payload.email){
		var typeSchema;
		if(req.payload.type === 'client')
			typeSchema = Client;
		if(req.payload.type === 'admin')
			typeSchema = Admin;
		User
			.findOne()
			.remove(function(err){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					typeSchema
						.findOne({userid:req.payload._id})
						.remove(function(err){
							if(err){
								sendJsonResponse(res, 404, err);
								return;
							} else {
								sendJsonResponse(res, 200, {
									message: "Пользователь удалён"
								});
							}
						});
					}
		});
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
}

module.exports.adminInfo = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		User
			.findOne({email:req.payload.email})
			.exec(function(err, user){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					Admin
						.findOne({userid:user._id})
						.exec(function(err, admin){
					console.log('admin'); 
						console.log(admin);
							if(err || !admin.cafeid){
								sendJsonResponse(res, 404, err);
								return;
							} else {
								console.log('почему ты здесь?!'); 
								sendJsonResponse(res, 200, {
									cafeid: admin.cafeid
								});
								return;
							}
					});
				}
			});
		
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
};

var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);
}