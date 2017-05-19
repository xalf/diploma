(function(){
	var navLoginCtrl = function($scope, $location, authentication){
		var vm = this;
		vm.clientLogin = authentication.isLoggedIn('client');
		vm.adminLogin = authentication.isLoggedIn('admin');
		vm.currentUser = authentication.currentUser();
		vm.currentPath = $location.path();
		vm.logout = function(){
			authentication.logout();
			$location.path('/');
				vm.clientLogin = false;
				vm.adminLogin = false;
		}
	};
	
	angular
		.module("cafeClientApp")
		.controller("navLoginCtrl", ['$scope', '$location', 'authentication', navLoginCtrl]);
})();