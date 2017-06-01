(function(){
	var dashboardCtrl = function($location, $uibModal, cafeData, authentication, workTableService){
		var vm = this; 
		vm.clientLogin = authentication.isLoggedIn('client');
		
		if(vm.clientLogin){
			vm.user = authentication.currentUser();
			authentication.getUserInfo().then(function(data){
				vm.user.img = data.data.img;
			});
			vm.updateProfile = function(){
				var modalUpdate = $uibModal.open({
					templateUrl: '/updateImageModal/updateImageModal.view.html',
					controller: 'updateImageModalCtrl as vm'
				});
				modalUpdate.result.then(function(img){
					vm.user.img = img;
				});
			};
			vm.deleteProfile = function(){
				var modalDelete = $uibModal.open({
					templateUrl: '/deleteUserModal/deleteUserModal.view.html',
					controller: 'deleteUserModalCtrl as vm'
				});
				modalDelete.result.then(function(){
					$location.path("/");
				});
			};
			
			vm.deleteOrder = function(order){
				workTableService.deleteOrder(order.id).then(function(data){
					for(i in vm.orders){
						if(vm.orders[i].id === order.id){
							vm.orders.splice(i, 1);
							break;
						}
					}
				}, function(e){
					console.log(e);
				});
			};
			
			workTableService.getOrderByClientId(vm.user._id).then(function(data){
					vm.orders = data.data;
					console.log(data);
				}, function(e){
					console.log(e);
				});
		} 
	};

	angular.module('cafeClientApp')
		.controller("dashboardCtrl", ['$location', '$uibModal', 'cafeData', 'authentication', 'workTableService', dashboardCtrl]);
})();