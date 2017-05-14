(function(){
	var random = function(){
		
		var getRandom = function(){
			return parseInt(Math.random()*10)+(+new Date());
		};
		
		return {
			getRandom: getRandom
		};
	}
	
	angular.module('cafeClientApp')
		.service('random', random);
})();