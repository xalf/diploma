(function(){
	var figureCtrl = function($scope, random){
		var wtf = this;
		
		fvm.figureStyle = {
			'background-color': random.getRandomColor(),
			'height': '40px',
			'wight': '40px',
			
		};
	};
	
	
	angular
		.module("constructApp")
		.controller("workTableCtrl", ['$scope', 'random', figureCtrl]);
})();