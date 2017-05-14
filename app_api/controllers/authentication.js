var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Client = mongoose.model('Client');
var Admin = mongoose.model('Admin');
var multiparty = require('multiparty');
var fs = require("fs");

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
			var saveType = function(err){
				if(err)
					sendJsonResponse(res, 404, err);
				else 
					sendJsonResponse(res, 200, {
						'token': token
					});
			};
			if(req.body.type === 'client'){
				var client = new Client();
				client.userid = user._id;
				client.save(saveType);
			}
			if(req.body.type === 'admin'){
				var admin = new Admin();
				admin.userid = user._id;
				admin.save(saveType);
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
					var form = new multiparty.Form();
					var uploadFile = {path: './public/upload/', type: '', size: 0};
					//максимальный размер файла
					var maxSize = 2 * 1024 * 1024; //2MB
					//поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
					var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
					//массив с ошибками произошедшими в ходе загрузки файла
					var errors = [];

					 //если произошла ошибка
					form.on('error', function(err){
						if(fs.existsSync(uploadFile.path)) {
							//если загружаемый файл существует удаляем его
							fs.unlinkSync(uploadFile.path);
							console.log('error');
						}
					});

					form.on('close', function() {
						//если нет ошибок и все хорошо
						if(errors.length == 0) {
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
							
						}
						else {
							if(fs.existsSync(uploadFile.path)) {
								//если загружаемый файл существует удаляем его
								fs.unlinkSync(uploadFile.path);
							}
							//сообщаем что все плохо и какие произошли ошибки
							sendJsonResponse(res, 404, errors);
						}
					});

					// при поступление файла
					form.on('part', function(part) {
						//читаем его размер в байтах
						uploadFile.size = part.byteCount;
						//читаем его тип
						uploadFile.type = part.headers['content-type'];
						//путь для сохранения файла
						uploadFile.path += part.filename;

						//проверяем размер файла, он не должен быть больше максимального размера
						if(uploadFile.size > maxSize) {
							errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
						}

						//проверяем является ли тип поддерживаемым
						if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
							errors.push('Unsupported mimetype ' + uploadFile.type);
						}

						//если нет ошибок то создаем поток для записи файла
						if(errors.length == 0) {
							var out = fs.createWriteStream(uploadFile.path);
							part.pipe(out);
						}
						else {
							//пропускаем
							//вообще здесь нужно как-то остановить загрузку и перейти к onclose
							part.resume();
						}
					});

					// парсим форму
					form.parse(req);
					
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
							if(err){
								sendJsonResponse(res, 404, err);
								return;
							} else {
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