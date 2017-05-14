(function(){
	var workTableCtrl = function($scope){
		var wtvm = this;
	
		wtvm.addCircle = function(){};
		wtvm.addRectangle = function(){};
		wtvm.delete = function(){};
		wtvm.clear = function(){};
		wtvm.group = function(){};
		wtvm.ungroup = function(){};
		wtvm.save = function(){};
	};
	
	
	angular
		.module("constructApp")
		.controller("workTableCtrl", ['$scope', workTableCtrl]);
})();