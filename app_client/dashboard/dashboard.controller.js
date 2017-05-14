(function(){
	var dashboardCtrl = function($location, $uibModal, cafeData, authentication){
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
			var test = new Date();
			vm.orders = [
				{
					cafe: "Перчини",
					date: test.setDate(test.getDate()+7),
					dateEnd: test.setHours(test.getHours()+4),
					table: {
						numberOfSeats: 3,
						number: 2,
					}
				},
				{
					cafe: "Перчини2",
					date: test.setDate(test.getDate()+3),
					dateEnd: test.setHours(test.getHours()+3),
					table:{
						numberOfSeats: 2,
						number: 4,
					}
				},
				{
					cafe: "Перчини3",
					date: test.setDate(test.getDate()-4),
					dateEnd: test.setHours(test.getHours()+2),
					table:{
						numberOfSeats: 3,
						number: 7,
					}
				}
			];
		} 
	};

	angular.module('cafeClientApp')
		.controller("dashboardCtrl", ['$location', '$uibModal', 'cafeData', 'authentication', dashboardCtrl]);
})();