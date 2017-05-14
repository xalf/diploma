(function(){
	var loginCtrl = function($location, authentication){
		var vm = this;
		vm.credentials = {
			email: "",
			password: "",
			type: ""
		};
		
		vm.returnPage = $location.search().page || '/';
		
		vm.onSubmit = function(){
			vm.formError = "";
			if(!vm.credentials.email || !vm.credentials.password){
				vm.formError = "Не все поля заполнены";
				return false;
			} else {
				vm.doLogin();
			}
		}
		
		vm.doLogin = function(){
			vm.formError = "";
			authentication
				.login(vm.credentials)
				.then(function(){
					$location.search('page', null);
					$location.path(vm.returnPage);
				}, function(err){
					vm.formError = err;
				});
		}
	};

	angular.module('cafeClientApp')
		.controller("loginCtrl", ['$location','authentication', loginCtrl]);
})();