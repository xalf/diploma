(function(){
	var cafeCtrl = function($routeParams, $location, $uibModal, cafeData, authentication){
		var vm = this;
		vm.message = "Загружаем информацию";
		vm.currentPath = $location.path();
		vm.clientLogin = authentication.isLoggedIn('client');
		if(vm.clientLogin)
			vm.userName = authentication.currentUser().name;
		
		cafeData.getCafeById($routeParams.cafeid).then(function(data){
			vm.cafe = data.data;
		}, function(e){
			vm.message = "Что-то пошло не так";
		});
		
		vm.removeReview = function(reviewid){
			cafeData.deleteReviewById(vm.cafe._id, reviewid)
				.then(function(){
					vm.cafe.reviews.forEach(function(item, i, arr){
						if(reviewid === item._id)
							arr.pop(item);
					});
					
				});
		};
		
		vm.popupOrder = function(){
			var modalOrder = $uibModal.open({
				templateUrl: '/orderModal/orderModal.view.html',
				controller: 'orderModalCtrl as vm'
			});
			modalOrder.result.then(function(data){
				console.log(data);
			});
		};
		
		vm.popupReviewForm = function(){
			var modalInstance = $uibModal.open({
				templateUrl: '/reviewModal/reviewModal.view.html',
				controller: 'reviewModalCtrl as vm',
				resolve: {
					cafeLittleData: function(){
						return {
							cafeid: vm.cafe._id,
							cafeName: vm.cafe.name,
							userName: vm.userName
						};
					}
				}
			});
			modalInstance.result.then(function(data){
				vm.cafe.reviews.push(data);
			});
		};
	};

	angular.module('cafeClientApp')
		.controller("cafeCtrl", ['$routeParams', '$location', '$uibModal', 'cafeData','authentication', cafeCtrl]);
})();