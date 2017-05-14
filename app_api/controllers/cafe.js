var mongoose = require("mongoose");
var cafeModel = mongoose.model('Cafe');
var adminModel = mongoose.model('Admin');

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
				adminModel
					.findOne({userid:req.payload._id})
					.exec(function(err, admin){
						if(err){
							sendJsonResponse(res, 404, err);
							return;
						} else {
							admin.cafeid = cafe._id;
							admin.save(function(err, admin){
								if(err)
									sendJsonResponse(res,404,err);
								else{
									console.log(admin);
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
				cafe.timetable= {
					days: req.body.timetableDay,
					close_hour: req.body.timetableCloseHour,
					close_minuts: req.body.timetableCloseMinuts,
					open_hour: req.body.timetableOpenHour,
					open_minuts: req.body.timetableOpenMinuts
				};
				cafe.contacts= {
					name: req.body.contacts.name,
					value: req.body.contacts.value,
					type: req.body.contacts.type
				};

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

module.exports.updateTable = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params.cafeid){
			
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