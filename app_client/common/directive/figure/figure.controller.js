(function(){
	var figureCtrl = function($document, $scope, $element, $attrs){
		var vm = this;
		var $figureObj = $($element).children();
		console.log($figureObj);
		var figurePosition;
		var $areaObj = $('#objects-area');
		var areaPosition;
		
		function coords(e){
			return {
				x: e.pageX - areaPosition.x,
				y: e.pageY - areaPosition.y
			};
		};
		
		var addPx = function(obj){
			var newObj = {};
			for (key in obj) {
				newObj[key] = obj[key] + 'px';
			}
			return newObj;
		};
		
		vm.figure = {
			figureStyle: {
				height: 50,
				width: 50,
				top: 0,
				left: 0
			},
			shiftX: 0,
        	shiftY: 0,
			x: 0,
			y: 0,
			isFocus: false
		}
		
		vm.figureMousedown = function($event){
			$event.stopPropagation();
			areaPosition = {
				x: $areaObj.offset().left,
				y: $areaObj.offset().top
			};
			figurePosition = {
				x: $figureObj.offset().left - areaPosition.x,
				y: $figureObj.offset().top - areaPosition.y
			};
			
			vm.figure.isFocus = true;
			
			var moveCoords = coords($event);
			vm.figure.shiftY = moveCoords.y - figurePosition.y;
			vm.figure.shiftX = moveCoords.x - figurePosition.x;
			
			$element.on('ondragstart', function(){
				return false;
			});
			
			$document.on('mousemove', function(e){
				var moveCoords = coords(e);
				
				vm.figure.figureStyle.top = moveCoords.y - vm.figure.shiftY;
				vm.figure.figureStyle.left = moveCoords.x - vm.figure.shiftX;
				$scope.$apply(function(){
					vm.figureStyle = addPx(vm.figure.figureStyle);
				});
			});
			
			$element.on('mouseup', function(e){
				
				
				$element.off('mouseup');
				$document.off('mousemove');
			});
		};
		
		vm.figureStyle = addPx(vm.figure.figureStyle);
	};
	
	
	
	angular
		.module("cafeClientApp")
		.controller("figureCtrl", ['$document', '$scope', '$element', '$attrs', figureCtrl]);
})();