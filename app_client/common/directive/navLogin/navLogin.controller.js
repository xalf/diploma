(function(){
	var navLoginCtrl = function($location, authentication){
		var vm = this;
		vm.isLoggedIn = authentication.isLoggedIn();
		vm.currentUser = authentication.currentUser();
		vm.currentPath = $location.path();
		vm.logout = function(){
			authentication.logout();
			$location.path('/');
		}
	};
	
	angular
		.module("cafeClientApp")
		.controller("navLoginCtrl", ['$location', 'authentication', navLoginCtrl]);
})();