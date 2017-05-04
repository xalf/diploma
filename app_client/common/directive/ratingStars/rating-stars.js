(function(){
	var ratingStars = function(){
		return {
			restrict: 'EA',
			scope:{
				thisRating: '=rating'
			},
			templateUrl: "/common/directive/ratingStars/rating-stars.html"
		};
	};

	angular
		.module("cafeClientApp")
		.directive("ratingStars", ratingStars);
})();
