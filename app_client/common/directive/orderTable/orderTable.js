(function(){
	var orderTable = function(){
		return {
			restrict: 'EA',
			templateUrl: '/common/directive/orderTable/orderTable.view.html',
			controller: 'orderTableCtrl as otvm'
		}	
	};
	
	angular
		.module('cafeClientApp')
		.directive('orderTable', orderTable);
})();