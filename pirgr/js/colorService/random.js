(function(){
	var random = function($scope){
		
		var getRandom = function(){
			return parseInt(Math.random()*1000)+(+new Date());
		};
		
		return {
			getRandom: getRandom
		};
	}
	
	angular.module('constructApp')
		.service('random', ['$scope',random]);
})();