var mongoose = require("mongoose");
var cafeModel = mongoose.model('Cafe');

module.exports.cafesByFilter = function(req,res){
	if(req.query && req.query.value && req.query.filter){
		var queryObj = {};
		queryObj[req.query.filter] = req.query.value;
		cafeModel.find(queryObj).exec(function(err, cafes){
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
	} else {
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
	}
};

module.exports.cafesCreate = function(req,res){
	console.log(typeof req.body.contacts[0]);
	var cafeObj = {
			name: req.body.name,
			address: req.body.address,
			cuisine: req.body.cuisine,
			check: req.body.check,
			payments: [],
			timetable: [],
			contacts: []
		};
	console.log(req.body.contacts.forEach);
	req.body.contacts.forEach(function(item, i, arr){
		cafeObj.contacts.push(item);
		console.log(item);
	});
	console.log(req.body.payments.forEach);
	req.body.payments.forEach(function(item, i, arr){
		cafeObj.payments.push(item);
	});
	console.log(req.body.days.forEach);
	req.body.days.forEach(function(item, i, arr){
		cafeObj.timetable.push(item);
	});
	cafeModel.create(cafeObj,function(err, cafe){
		if(err)
			sendJsonResponse(res,404,err);
		else
			sendJsonResponse(res,200,cafe);
	});
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
	if(req.params.cafeid){
		cafeModel.findByIdAndRemove(req.params.cafeid).exec(function(err, cafe){
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
};

module.exports.cafeUpdate = function(req,res){
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
};

var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);
}