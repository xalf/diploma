var mongoose = require("mongoose");
var Order = mongoose.model('Order');
var Table = mongoose.model('Table');
var Cafe = mongoose.model('Cafe');

module.exports.getOrdersByCafeId = function(req, res){
	if(req.payload && req.payload.email && req.payload.type === 'admin'){
		if(req.params && req.params.cafeid){
			Order
				.find({cafeid: req.params.cafeid})
				.exec(function(err, order){
					if(err)
						sendJsonResponse(res, 404, err);
					else{
						var returnObj = [];
						orders.forEach(function(item, i, arr){
							Client
								.findById(order.clientid)
								.exec(function(err, client){
									if(!err){
										returnObj.push({
											client: client.name,
											dateEnd: order.dateEnd,
											date: order.date,
											tableNumber: order. tableNumber
										});
									}
								});
						});
						sendJsonResponse(res, 200, returnObj);
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
						var returnObj = [];
						orders.forEach(function(item, i, arr){
							Cafe
								.findById(item.cafeid)
								.exec(function(err, cafe){
									if(!err){
										returnObj.push({
											cafe: cafe.name,
											dateEnd: item.dateEnd,
											date: item.date,
											tableNumber: item. tableNumber
										});
									}
								});
							});
						sendJsonResponse(res, 200, returnObj);
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
				sendJsonResponse(res, 200, order);
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