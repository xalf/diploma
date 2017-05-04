(function(){
	var reviewModalCtrl = function($uibModalInstance,cafeData,cafeLittleData){
		var vm = this;
		vm.cafeData = cafeLittleData;
		vm.modal = {
			cancel: function(){
				$uibModalInstance.dismiss('cancel');
			},
			close: function(result){
				$uibModalInstance.close(result.data);
			}
		};
		vm.onSubmit = function(){
			vm.formError = "";
			if(!vm.formData.rating || !vm.formData.reviewText){
				vm.formError = "Не все поля заполнены";
				return false;
			} else {
				vm.doAddReview(cafeLittleData.cafeid, vm.formData);
			}
			
		}
		vm.doAddReview = function(cafeid, formData){
			cafeData.addReviewById(cafeid, {
				rating: formData.rating,
				reviewText: formData.reviewText
			})
			.then(function(data){
				vm.modal.close(data);
			}, function(e){
				vm.formError = "Ваш отзыв не удалось отправить, попробуйте снова";
			});
			return false;
		};
	};
	
	

	angular.module('cafeClientApp')
		.controller("reviewModalCtrl", ['$uibModalInstance', 'cafeData', 'cafeLittleData',reviewModalCtrl]);
})();