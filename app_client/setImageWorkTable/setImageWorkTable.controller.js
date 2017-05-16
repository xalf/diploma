(function(){
	var setImageWorkTableCtrl = function($uibModalInstance, FileUploader, authentication, cafeid){
		var vm = this;
		console.log(cafeid);
		vm.uploader = new FileUploader({
			url: '/api/cafe/' + cafeid + '/worktableimg',
			headers: {
				Authorization: 'Bearer ' + authentication.getToken()
			}
		});
		vm.uploader.filters.push({
			name: 'imageFilter',
			fn: function(item /*{File|FileLikeObject}*/, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		vm.uploader.onCompleteItem = function(fileItem, response, status, headers) {
			if(status!=200){
				vm.formError = "Что-то пошло не так, фотография не обновилась";
			} else {
				vm.modal.close(response);
			}
		};
		
		vm.modal = {
			cancel: function(){
				$uibModalInstance.dismiss('cancel');
			},
			close: function(data){
				$uibModalInstance.close(data);
			} 
		};
		vm.onSubmit = function(){
			vm.uploader.uploadAll();
		}
	};
	
	

	angular.module('cafeClientApp')
		.controller("setImageWorkTableCtrl", ['$uibModalInstance', 'FileUploader', 'authentication', 'cafeid', setImageWorkTableCtrl]);
})();

