(function(){
	var deleteUserModalCtrl = function($uibModalInstance,authentication){
		var vm = this;
		vm.modal = {
			cancel: function(){
				$uibModalInstance.dismiss('cancel');
			},
			close: function(){
				$uibModalInstance.close();
			}
		};
		vm.onSubmit = function(){
			authentication.deleteUser()
				.then(function(){
					authentication.logout();
					vm.modal.close();
				}, function(e){
					vm.formError = "Не удалось удалить пользователя";
				});
		}
	};
	
	

	angular.module('cafeClientApp')
		.controller("deleteUserModalCtrl", ['$uibModalInstance', 'authentication', deleteUserModalCtrl]);
})();