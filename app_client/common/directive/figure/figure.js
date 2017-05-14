(function(){
	var figure = function(){
		return {
			restrict: 'EA',
			templateUrl: '/common/directive/figure/figure.view.html',
			controller: 'figureCtrl as fvm',
			scope: {
				id: '@figureId'
			},
			require: '^^workTable',
			link: function(scope, element, attrs, workTableCtrl){
				workTableCtrl.addFigure(scope);
			}
		}	
	};
	
	angular
		.module('cafeClientApp')
		.directive('figure', figure);
})();