angular.module("cafeClientApp",[]);



var ratingStars = function(){
	return {
		scope:{
			thisRating: '=rating'
		},
		templateUrl: "/templates/rating-stars.html"
	};
};

var cafeData = function($http){
//	return [{
//			name: "Академия кофе",
//			address: "ул.Амурская, 167",
//			cuisine: "Японская кухня",
//			payments: ["MasterCard","Visa"],
//			timetable: [{
//				days: "Пн-Ср",
//				close_hour: 23,
//				close_minuts: 0,
//				open_hour: 9,
//				open_minuts: 0
//			}],
//			contacts: [{
//				name: "ВК",
//				value: "https://vk.com",
//				type: "url"
//			},
//			{
//				name: "телефон",
//				value: "88888888",
//				type: "tel"
//			}],
//			reviews: [{
//				author: "Вован",
//				rating: 4,
//				reviewText: "Отличное место",
//				createOn:Date.now()
//			}],
//			rating: 4,
//			create: Date.now(),
//			order: 3,
//			check: 300
//		},{
//			name: "Перчини",
//			address: "ул.Зейская, 56",
//			cuisine: "Итальянская кухня",
//			payments: ["MasterCard","Visa"],
//			timetable: [{
//				days: "Пн-Ср",
//				close_hour: 23,
//				close_minuts: 0,
//				open_hour: 9,
//				open_minuts: 0
//			}],
//			contacts: [{
//				name: "ВК",
//				value: "https://vk.com",
//				type: "url"
//			},{
//				name: "телефон",
//				value: "88888888",
//				type: "tel"
//			}],
//			reviews: [{
//				author: "Вован",
//				rating: 4,
//				reviewText: "Отличное место",
//				createOn:Date.now()
//			}],
//			rating: 4,
//			create: Date.now(),
//			order: 3,
//			check: 300
//		}];
	return $http.get('/api/cafe');
};
var cafeListCtrl = function($scope,cafeData){
	console.log(cafeData);
	$scope.message = "Загружаем список";
	cafeData.then(function(data){
		$scope.message = data.data.length > 0 ? "" : "Список пуст";
		$scope.data = {
			cafes: data.data 
		};
	}, function(e){
		$scope.message = "Что-то пошло не так";
	});
	$scope.filters = ["Новое", "Популярное", "Кухня", "Способ оплаты", "Рейтинг", "Чек"];
};

angular
	.module("cafeClientApp")
	.controller("cafeListCtrl", cafeListCtrl)
	.directive("ratingStars", ratingStars)
	.service('cafeData', cafeData);