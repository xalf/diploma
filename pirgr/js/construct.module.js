(function(){
	var app = angular.module('constructApp', []);
	
	var workTable = function(){
		return {
			restrict: 'EA',
			templateUrl: 'js/workTable/workTable.view.html',
			controller: 'workTableCtrl as wtvm'
		}	
	};
	
	var figure = function(){
		return {
			restrict: 'EA',
			templateUrl: 'js/figure/figure.view.html',
			controller: 'figureCtrl as fvm'
		}	
	};
	
	angular
		.module('constructApp')
		.directive('workTable', workTable)
		.directive('figure', figure);
})();