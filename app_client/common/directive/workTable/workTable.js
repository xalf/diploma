(function(){
	var workTable = function(){
		return {
			restrict: 'EA',
			templateUrl: '/common/directive/workTable/workTable.view.html',
			controller: 'workTableCtrl as wtvm'
		}	
	};
	
	angular
		.module('cafeClientApp')
		.directive('workTable', workTable);
})();