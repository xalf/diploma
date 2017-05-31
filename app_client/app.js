(function(){
	var app = angular.module('cafeClientApp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload']);

	angular.module('cafeClientApp')
		.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
			$locationProvider.html5Mode({
			  enabled: true,
			  requireBase: false
			});
			$routeProvider
				.when('/',{
					templateUrl: '/home/home.view.html',
					controller: "homeCtrl",
					controllerAs: 'vm'
				})
				.when('/cafe/:cafeid',{
					templateUrl: '/cafe/cafe.view.html',
					controller: "cafeCtrl",
					controllerAs: 'vm'
				})
				.when('/register',{
					templateUrl: '/auth/register/register.view.html',
					controller: "registerCtrl",
					controllerAs: 'vm'
				})
				.when('/login',{
					templateUrl: '/auth/login/login.view.html',
					controller: "loginCtrl",
					controllerAs: 'vm'
				})
				.when('/dashboard',{
					templateUrl: '/dashboard/dashboard.view.html',
					controller: "dashboardCtrl",
					controllerAs: 'vm'
				})
				.when('/admin',{
					templateUrl: '/admin/admin.view.html',
					controller: "adminCtrl",
					controllerAs: 'vm'
				})
				.when('/404',{
					templateUrl: '/404.html'
				})
				.otherwise({redirectTo: '/404'});
		}
	]);
})();