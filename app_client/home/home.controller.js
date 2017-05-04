(function(){
	var homeCtrl = function(cafeData){
		var vm = this;
		vm.selectFilter = "rating";
		vm.cuisineNames = ["Французская кухня", "Итальянская кухня", "Японская кухня", "Китайская кухня", "Русская кухня", "Грузинская кухня","Вьетнамская кухня"];
		vm.paymentNames = ["Наличные", "Банковская карта", "Через интернет"];
		vm.textFilter = "";
		vm.message = "Загружаем список";
		cafeData.getCafeList().then(function(data){
			vm.message = data.data.length > 0 ? "" : "Список пуст";
			vm.data = {
				cafes: data.data 
			};
		}, function(e){
			vm.message = "Что-то пошло не так";
		});
	};

	angular.module('cafeClientApp')
		.controller("homeCtrl", ['cafeData',homeCtrl]);
})();