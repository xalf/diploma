var mongoose = require("mongoose");
var Order = mongoose.model('Order');
var Table = mongoose.model('Table');
var Cafe = mongoose.model('Cafe');
var User = mongoose.model('User');

module.exports.getOrdersByCafeId = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params && req.params.cafeid){
			Order
				.find({cafeid: req.params.cafeid})
				.exec(function(err, orders){
					if(err)
						sendJsonResponse(res, 404, err);
					else{
						User.find().exec(function(err, clients){
							if(err){
								sendJsonResponse(res, 404, err);
								return;
							}
							var returnObj = [];
							for(var i = 0; i < orders.length; i++){
								for(var j = 0; j < clients.length; j++){
									if(clients[j]._id == orders[i].clientid){
										returnObj.push({
											client: clients[j].name,
											dateEnd: orders[i].dateEnd,
											date: orders[i].date,
											tableNumber: orders[i].tableNumber
										});
									}
								}
							}
							sendJsonResponse(res, 200, returnObj);
						});
					}
				});
		} else {
			sendJsonResponse(res, 404, {
				message: 'cafeid not found'
			});
			return;
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
}

module.exports.getOrdersByClientId = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'client'){
		if(req.params && req.params.clientid){
			Order
				.find({clientid: req.params.clientid})
				.exec(function(err, orders){
					if(err)
						sendJsonResponse(res, 404, err);
					else{
						Cafe.find().exec(function(err, cafes){
							if(err){
								sendJsonResponse(res, 404, err);
								return;
							}
							Table.find().exec(function(err, tables){
								if(err){
									sendJsonResponse(res, 404, err);
									return;
								}
								var returnObj = [];
								for(var i = 0; i < orders.length; i++){
									var one = {
										id: orders[i]._id,
										dateEnd: orders[i].dateEnd,
										date: orders[i].date,
										tableNumber: orders[i].tableNumber
									};
									for(var j = 0; j < cafes.length; j++){
										if(cafes[j]._id == orders[i].cafeid){
											one.cafe = cafes[j].name;
										}
									}
									for(var j = 0; j < tables.length; j++){
										if(tables[j].number === orders[i].tableNumber 
										   && tables[j].cafeid === orders[i].cafeid){
										   one.tableNumber = tables[j].number;
										   one.numberOfSeats = tables[j].numberOfSeats;
										}
									}
									returnObj.push(one);
								}
								sendJsonResponse(res, 200, returnObj);
							});
						});
					}
				});
		} else {
			sendJsonResponse(res, 404, {
				message: 'cafeid not found'
			});
			return;
		}
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
}

module.exports.addOrder = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'client'){
		var orderObj = {
			clientid: req.payload._id,
			date: req.body.date,
			dateEnd: req.body.dateEnd,
			cafeid: req.body.cafeid,
			tableNumber: req.body.tableNumber
		};
		Order.create(orderObj,function(err, order){
			if(err)
				sendJsonResponse(res,404,err);
			else{
				Cafe.findById(req.body.cafeid).exec(function(err, cafe){
					cafe.order += 1;
					cafe.save(function(err, cafe){
						if(err)
							sendJsonResponse(res, 404, err);
						else
							sendJsonResponse(res, 200, order);
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

module.exports.deleteOrder = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'client'){
		if(req.params.orderid){
			Order
				.findByIdAndRemove(req.params.orderid)
				.exec(function(err, order){
					if(err){
						sendJsonResponse(res, 404, err);
						return;
					} else 
						sendJsonResponse(res, 204, null);
			});
		} else{
			sendJsonResponse(res,404,{
				message: "not orderid in params"
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