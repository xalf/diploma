(function(){
	var updateCafeImageModalCtrl = function($uibModalInstance, FileUploader, authentication, cafeid){
		var vm = this;
		
		var uploader = vm.uploader = new FileUploader({
            url: '/api/cafe/' + cafeid + '/image',
			headers: {
				Authorization: 'Bearer ' + authentication.getToken()
			}
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
		
		uploader.onCompleteItem = function(fileItem, response, status, headers) {
			if(status!=200){
				vm.formError = "Что-то пошло не так, фотография не обновилась";
			} else {
				vm.modal.close(response.img);
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
			uploader.uploadAll();
		}
	};
	
	

	angular.module('cafeClientApp')
		.controller("updateCafeImageModalCtrl", ['$uibModalInstance', 'FileUploader', 'authentication', 'cafeid', updateCafeImageModalCtrl]);
})();

