var mongoose = require("mongoose");
var cafeModel = mongoose.model('Cafe');
var orderModel = mongoose.model('Order');
var tableModel = mongoose.model('Table');
var adminModel = mongoose.model('Admin');
var saveImg = require('../saveImg');

module.exports.cafesByFilter = function(req,res){
	cafeModel.find().exec(function(err, cafes){
		if(!cafes){
			sendJsonResponse(res,404,{
				message: "cafeid not found"
			});
			return;
		} else if (err) {
			sendJsonResponse(res,404,err);
			return;
		}
		sendJsonResponse(res, 200, cafes);
	});	
};

module.exports.cafesCreate = function(req,res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		adminModel
			.findOne({userid:req.payload._id})
			.exec(function(err, admin){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					if(admin.cafeid != ""){
						sendJsonResponse(res, 404, {
							message: "Этот пользователь уже создал кафе"
						});
						return;
					}
					
					var cafeObj = {
						name: req.body.name,
						address: req.body.address,
						cuisine: req.body.cuisine,
						check: req.body.check,
						payments: [],
						timetable: [],
						contacts: []
					};
					req.body.contacts.forEach(function(item, i, arr){
						cafeObj.contacts.push(item);
						console.log(item);
					});
					req.body.payments.forEach(function(item, i, arr){
						cafeObj.payments.push(item);
					});
					req.body.timetable.forEach(function(item, i, arr){
						cafeObj.timetable.push(item);
					});
					cafeModel.create(cafeObj,function(err, cafe){
						if(err)
							sendJsonResponse(res,404,err);
						else{
							admin.cafeid = cafe._id;
							admin.save(function(err, admin){
								if(err)
									sendJsonResponse(res,404,err);
								else{
									sendJsonResponse(res,200,cafe);
								}
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
};

module.exports.workTableInfo = function(req, res){
	if(req.params && req.params.cafeid){
		cafeModel.findById(req.params.cafeid).exec(function(err, cafe){
			if(!cafe){
				sendJsonResponse(res,404,{
					message: "cafeid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res,404,err);
				return;
			}
			var respoceObj = {
				workTableImg: cafe.workTableImg
			};
			tableModel.find({cafeid: cafe._id}).exec(function(err, tables){
				if(!tables || err){
					sendJsonResponse(res, 404, respoceObj);
					return;
				} 
				respoceObj.tables = tables;
				sendJsonResponse(res, 200, respoceObj);
			});
		});
	} else {
		sendJsonResponse(res,404, {
			message: "not cafeid in request"
		});	
	}
};

module.exports.getOrders = function(req, res){
	if(req.params && req.params.cafeid){
		orderModel
			.find({cafeid: req.params.cafeid})
			.exec(function(err, orders){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				}
				var resObj = [];
				orders.forEach(function(item, i, arr){
					resObj.push({
						dateEnd: item.dateEnd,
						date: item.date,
						tableNumber: item.tableNumber
					});
				});
				
				sendJsonResponse(res, 200, resObj);
					
			});
	} else {
		sendJsonResponse(res,404, {
			message: "not cafeid in request"
		});	
	}
};

module.exports.cafeInfo = function(req,res){
	if(req.params && req.params.cafeid){
		cafeModel.findById(req.params.cafeid).exec(function(err, cafe){
			if(!cafe){
				sendJsonResponse(res,404,{
					message: "cafeid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res,404,err);
				return;
			}
			sendJsonResponse(res, 200, cafe);
		});
	} else {
		sendJsonResponse(res,404, {
			message: "not cafeid in request"
		});	
	}
	
};

module.exports.cafeDelete = function(req,res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params.cafeid){
			cafeModel
				.findByIdAndRemove(req.params.cafeid)
				.exec(function(err, cafe){
					if(err){
						sendJsonResponse(res, 404, err);
						return;
					} else 
						sendJsonResponse(res, 204, null);
			});
		} else{
			sendJsonResponse(res,404,{
				message: "not cafeid in params"
			});
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}	
};

module.exports.cafeUpdate = function(req,res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params.cafeid){
			cafeModel.findById(req.params.cafeid).select('-rating -reviews').exec(function(err, cafe){
				if(!cafe){
					sendJsonResponse(res,404,{
						message: "cafeid not found"
					});
					return;
				} else if(err){
					sendJsonResponse(res,404,err);
					return;
				}
				
				cafe.name = req.body.name;
				cafe.address= req.body.address;
				cafe.cuisine= req.body.cuisine;
				cafe.payments= req.body.payments;
				cafe.check = req.body.check;
				cafe.payments = [];
				cafe.timetable = [];
				cafe.contacts = [];
				
				req.body.contacts.forEach(function(item, i, arr){
					cafe.contacts.push(item);
				});
				req.body.payments.forEach(function(item, i, arr){
					cafe.payments.push(item);
				});
				req.body.timetable.forEach(function(item, i, arr){
					cafe.timetable.push(item);
				});

				cafe.save(function(err, cafe){
					if(err)
						sendJsonResponse(res, 404, err);
					else
						sendJsonResponse(res, 200, cafe);
				});

			});
		} else {
			sendJsonResponse(res,404,{
				message: "not cafeid in request"
			});
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}	
};

module.exports.cafeUpdateImg = function(req,res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params.cafeid){
			cafeModel.findById(req.params.cafeid).select('img').exec(function(err, cafe){
				if(!cafe){
					sendJsonResponse(res,404,{
						message: "cafeid not found"
					});
					return;
				} else if(err){
					sendJsonResponse(res,404,err);
					return;
				}
				saveImg(req, function(uploadFile){
					var newLink = uploadFile.path.substr(9);
					cafe.img = newLink;
					
					cafe.save(function(err, cafe){
						if(err)
							sendJsonResponse(res, 404, err);
						else
							sendJsonResponse(res, 200, cafe);
					});
				});
			});
		} else {
			sendJsonResponse(res,404,{
				message: "not cafeid in request"
			});
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}	
};

module.exports.cafeUpdateWorkTableImg = function(req,res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params.cafeid){
			cafeModel.findById(req.params.cafeid).select('workTableImg').exec(function(err, cafe){
				if(!cafe){
					sendJsonResponse(res,404,{
						message: "cafeid not found"
					});
					return;
				} else if(err){
					sendJsonResponse(res,404,err);
					return;
				}
				saveImg(req, function(uploadFile){
					var newLink = uploadFile.path.substr(9);
					cafe.workTableImg = newLink;
					
					cafe.save(function(err, cafe){
						if(err)
							sendJsonResponse(res, 404, err);
						else
							sendJsonResponse(res, 200, cafe);
					});
				});
			});
		} else {
			sendJsonResponse(res,404,{
				message: "not cafeid in request"
			});
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}	
};

module.exports.updateTable = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params.cafeid){
			tableModel
				.find({cafeid: req.params.cafeid})
				.remove(function(err){
					if(err){
						sendJsonResponse(res, 404, err);
						return;
					} 
					tableModel.create(req.body, function(err, tables){
						if(err){
							sendJsonResponse(res, 404, err);
							return;
						}
						sendJsonResponse(res, 200, {
							message: "success"
						});
					});
				});
		} else{
			sendJsonResponse(res,404,{
				message: "not cafeid in params"
			});
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}	
}

var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);
}