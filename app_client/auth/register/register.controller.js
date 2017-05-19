(function(){
	var registerCtrl = function($location, authentication){
		var vm = this;
		vm.islogin = authentication.isLoggedIn('client') || authentication.isLoggedIn('admin');
		vm.credentials = {
			name: "",
			email: "",
			password: "",
			img: "",
			type: ""
		};
		
		vm.returnPage = $location.search().page || '/';
		
		vm.onSubmit = function(){
			vm.formError = "";
			if(!vm.credentials.name || !vm.credentials.email || !vm.credentials.password){
				vm.formError = "Не все поля заполнены";
				return false;
			} else {
				vm.doRegister();
			}
		}
		
		vm.doRegister = function(){
			vm.formError = "";
			authentication
				.register(vm.credentials)
				.then(function(){
					$location.search('page', null);
					$location.path(vm.returnPage);
				}, function(err){
					vm.formError = err;
				});
		}
	};

	angular.module('cafeClientApp')
		.controller("registerCtrl", ['$location','authentication', registerCtrl]);
})();