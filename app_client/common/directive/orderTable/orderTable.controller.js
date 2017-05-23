(function(){
var orderTableCtrl = function($scope, $routeParams, coordsService, authentication, workTableService){
	var vm = this;
	vm.figures = [];
	var cafeid;
	vm.workTableImg = {};
	var Figure = function(type){
		this.index;
		this.numberOfSeats = 0;
		this.type = type;
		this.classes = [type, 'fig'];
		this.style =  {
			height: 50,
			width: 50,
			top: 0,
			left: 0
		};
	};
	workTableService
		.getWorkTableInfo($routeParams.cafeid)
		.then(function(data){
			var img = new Image();
			img.src = '/' + data.data.workTableImg;
		
			img.onload = function(){
				$scope.$apply(function(){
					vm.workTableImg['background-image'] = 'url("' + img.src + '")';
					vm.workTableImg['width'] = img.width + 'px';
					vm.workTableImg['height'] = img.height + 'px';
				});
				console.log(vm.workTableImg);
			};
			var arr = data.data.tables;
			for(i in arr){
				var fig = new Figure(arr[i].type);
				fig.style.width = arr[i].width;
				fig.style.height = arr[i].height;
				fig.style.left = arr[i].x;
				fig.style.top = arr[i].y;
				fig.numberOfSeats = arr[i].numberOfSeats;
				fig.index = arr[i].number;
				vm.figures.push(fig);
			}
		}, function(e){
			console.log(e);
		});
};
	
angular
	.module("cafeClientApp")
	.controller("orderTableCtrl", ['$scope', '$routeParams', 'coordsService', 'authentication', 'workTableService', orderTableCtrl]);
})();