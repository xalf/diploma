(function(){
	var navLogin = function(){
		return {
			restrict: 'EA',
			templateUrl: "/common/directive/navLogin/navLogin.html",
			controller: 'navLoginCtrl as navvm'
		};
	};

	angular
		.module("cafeClientApp")
		.directive("navLogin", navLogin);
})();