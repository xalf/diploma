var request = require('request');
var apiOptions = {
	server: "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production'){
	apiOptions.server = 'https://gentle-cliffs-29503.herokuapp.com/'
}

module.exports.angularApp = function(req, res){
	res.render('layout', {title:"Заказ столиков"});
}

module.exports.index = function(req, res, next) {
	renderIndex(req, res);  	
}
module.exports.admin = function(req, res, next) {
  res.render('admin', { title: 'Express' });
}
module.exports.cafe = function(req, res, next) {
  getCafeInfo(req, res, function(req, res, responseData){
	  renderCafe(req, res, responseData);
  });
}

module.exports.addReview = function(req, res, next) {
  getCafeInfo(req, res, function(req, res, responseData){
	  renderReviewForm(req, res, responseData);
  });
}

module.exports.doAddReview = function(req, res, next) {
  var postdata = {
	  author: req.body.name,
	  rating: parseInt(req.body.rating, 10),
	  reviewText: req.body.review
  };
	var cafeid = req.params.cafeid;
	var path = '/api/cafe/'+cafeid + '/reviews';
	var requestOptions = {
		url: apiOptions.server + path,
		method: 'POST',
		json: postdata
	};
	if(!postdata.author || !postdata.rating || !postdata.reviewText)
		res.redirect('/cafe/' + cafeid + '/review/add?err=val');
	else
		request(requestOptions, function(err, response, body){
			console.log(body);
			if (response.statusCode === 201){
				res.redirect('/cafe/' + cafeid);
			} else if(response.statusCode === 404 && body.name && body.name === 'ValidationError'){
				res.redirect('/cafe/' + cafeid + '/review/add?err=val');
			} else {
				_showError(req, res, response.statusCode);
			}
		});
}

var getCafeInfo = function(req, res, callback){
	var path = '/api/cafe/'+req.params.cafeid;
	var requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {}
	}

	request(requestOptions, function(err, response, body){
		if (response.statusCode === 200){
			callback(req, res, body);
		} else {
			_showError(req, res, response.statusCode);
		}
	});
}

var renderReviewForm = function(req, res, responseBody){
	res.render('addReview',{
	  pageInfo: {
		  title: "Отзыв о " + responseBody.name,
		  error: req.query.err,
		  url: req.originalUrl
	  }
  });
}

var renderCafe = function(req, res, responseBody){
	res.render('cafe', {
	  pageInfo: {
		  title: "Заказ столиков"
	  },
	  cafe: responseBody
  });
}

var renderIndex = function(req, res){
	res.render('index', {
	  pageInfo: {
		  title: "Заказ столиков"
	  }
  });
}

var _showError = function(req, res, status){
	var data = {
		title: status,
		content: "Что-то пошло не так"
	};
	res.status(status);
	res.render('generic-text', data);
	
}