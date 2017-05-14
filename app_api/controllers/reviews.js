var mongoose = require("mongoose");
var cafeModel = mongoose.model('Cafe');
var User = mongoose.model('User');

module.exports.reviewCreate = function(req,res){
	getAuthor(req, res, function(req, res, userName){
		if(req.params.cafeid){
			cafeModel
				.findById(req.params.cafeid)
				.select('reviews')
				.exec(function(err, cafe){
					if(err)
						sendJsonResponse(res, 404, err);
					else
						doAddReview(req, res, cafe, userName);
				});
		} else {
			sendJsonResponse(res,404,{
				message: "not cafeid in request"
			});
		}
	});
};

module.exports.reviewDelete = function(req,res){
	if(req.params && req.params.cafeid && req.params.reviewid){
		cafeModel.findById(req.params.cafeid).select('name reviews').exec(function(err, cafe){
			if(!cafe){
				sendJsonResponse(res,404,{
					message: "cafeid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res,404,err);
				return;
			}
			if(cafe.reviews && cafe.reviews.length > 0){
				if(!cafe.reviews.id(req.params.reviewid)){
					sendJsonResponse(res,404,{
						message: "review not found"
					});
				} else {
					cafe.reviews.id(req.params.reviewid).remove();
					cafe.save(function(err){
						if(err)
							sendJsonResponse(res, 404, err);
						else {
							updateAverageRating(cafe._id);
							sendJsonResponse(res, 204, null);
						}
					});
				}
			} else {
				sendJsonResponse(res, 404, {
					message: "Отзывов не найдено"
				});
			}
		});
	} else {
		sendJsonResponse(res,404, {
			message: "not cafeid and reviewid in request"
		});	
	}
};
module.exports.reviewUpdate = function(req,res){
	if(req.params && req.params.cafeid && req.params.reviewid){
		cafeModel.findById(req.params.cafeid).select('reviews').exec(function(err, cafe){
			var thisReview;
			if(!cafe){
				sendJsonResponse(res,404,{
					message: "cafeid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res,404,err);
				return;
			}
			if(cafe.reviews && cafe.reviews.length > 0){
				thisReview = cafe.reviews.id(req.params.cafeid);
				if(!thisReview)
					sendJsonResponse(res,404,{
						message: "reviewid not found"
					});
				else{
					thisReview.author = req.body.author;
					thisReview.rating = req.body.rating;
					thisReview.reviewText = req.body.reviewText;
					cafe.save(function(err, cafe){
						if(err){
							sendJsonResponse(res,404,err);
						} else {
							updateAverageRating(cafe._id);
							sendJsonResponse(res, 201, thisReview);
						}
					});
				}
			}
		});
	} else{
		sendJsonResponse(res,404, {
			message: "not cafeid and reviewid in request"
		});	
	}
};

module.exports.reviewsReadOne = function(req, res){
	if(req.params && req.params.cafeid && req.params.reviewid){
		cafeModel.findById(req.params.cafeid).select('name reviews').exec(function(err, cafe){
			var review, response;
			if(!cafe){
				sendJsonResponse(res,404,{
					message: "cafeid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res,404,err);
				return;
			}
			if(cafe.reviews && cafe.reviews.length > 0){
				review = cafe.reviews.id(req.params.reviewid);
				if(!review){
					sendJsonResponse(res,404,{
						message: "reviewid not found"
					});
					return;
				} else {
					response = {
						cafe: {
							name: cafe.name,
							id: req.params.cafeid
						},
						review: review
					};
					sendJsonResponse(res, 200, response);
				}
			} else {
				sendJsonResponse(res, 404, {
					message: "Отзывов не найдено"
				});
			}
		});
	} else {
		sendJsonResponse(res,404, {
			message: "not cafeid and reviewid in request"
		});	
	}
}

var getAuthor = function(req, res, callback){
	if(req.payload && req.payload.email){
		User
			.findOne({email:req.payload.email})
			.exec(function(err,user){
				if(!user){
					sendJsonResponse(res, 404, {
						"message": "Такого пользователя не найдено"
					});
					return;
				} else if(err){
					console.log(err);
					sendJsonResponse(res, 404, err);
					return;
				}
				callback(req, res, user.name);
		});
	} else {
		sendJsonResponse(res, 404, {
			"message": "Такого пользователя не найдено"
		});
		return;
	}
}

var doAddReview = function(req, res, cafe, user){
	cafe.reviews.push({
		author: user,
		rating: req.body.rating,
		reviewText: req.body.reviewText
	});
	console.log(typeof req.body.reviewText);
	cafe.save(function(err, cafe){
		if(err){
			sendJsonResponse(res,404,err);
		} else {
			updateAverageRating(cafe._id);
			thisReview = cafe.reviews[cafe.reviews.length - 1];
			sendJsonResponse(res, 201, thisReview);
		}
	});
}

var updateAverageRating = function(cafeid){
	cafeModel.findById(cafeid).select('rating reviews').exec(function(err, cafe){
		if(!err)
			doSetAverageRating(cafe);
	});
}

var doSetAverageRating = function(cafe){
	var i, reviewCount, ratingAverage, ratingTotal;
	if(cafe.reviews && cafe.reviews.length > 0){
		reviewCount = cafe.reviews.length;
		ratingTotal = 0;
		for(i = 0; i < reviewCount; i++)
			ratingTotal += cafe.reviews[i].rating;
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		cafe.rating = ratingAverage;
		cafe.save(function(err){
			if(err)
				console.log(err);
			else
				console.log("Average rating update to" + ratingAverage);
		});
	}
}

var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);
}