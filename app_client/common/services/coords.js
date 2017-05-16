(function(){
	var coordsService = function(){
		return function(selector, relative){
			var obj = $(selector);
			this.x = null;
			this.y = null;
			this.update = function(){
				if(relative !== undefined){
					this.x = obj.offset().left - relative.x;
					this.y = obj.offset().top - relative.y;
				} else {
					this.x = obj.offset().left;
					this.y = obj.offset().top;
				}
			}
			
			this.update();
		};
	}
	
	angular.module('cafeClientApp')
		.factory('coordsService', coordsService);
})();