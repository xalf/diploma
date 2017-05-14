(function(){
	var workTableCtrl = function($scope, $document, random){
		var vm = this;
		
		this.addFigure = function(figureScope){
			vm.figures.forEach(function(item){
				if(item.id === figureScope.id)
					item.scope = figureScope;
			});
		};
		
		var $areaObj = $('#objects-area');
		var areaPosition;
		
		vm.figures = [];
		vm.focusObj = null;
		function coords(e){
			return {
				x: e.pageX - areaPosition.x,
				y: e.pageY - areaPosition.y
			};
		};
		
		vm.sFrameStyle = {
			height: 0,
			width: 0,
			top: 0,
			left: 0,
			visibility: 'hidden'
		};
		
		vm.workTableMousedown = function(e){
			if(focusObj !== null){
				focusObj.setFocus(false);
				if(focusObj.id != e.currentTarget.dataset.id && figuresList[focusObj.id] === undefined){
					focusObj.delete();
					focusObj = null;
				}
			} 
			
			areaPosition = {
				x: $areaObj.offset().left,
				y: $areaObj.offset().top
			};

			var startCoords = coords(e);
			
			$document.on('mousemove', function(e){
				console.log('move');
				var moveCoords = coords(e);
				
				var x1 = startCoords.x,
					y1 = startCoords.y,
					x2 = moveCoords.x,
					y2 = moveCoords.y;
				
				if (x1 == x2 || y1 == y2) return;
				if (x1 > x2){
					x1 = x1+x2;
					x2 = x1-x2;
					x1 = x1-x2;
				}
				if (y1 > y2){
					y1 = y1+y2;
					y2 = y1-y2;
					y1 = y1-y2;
				}
				
				$scope.$apply(function(){
					vm.sFrameStyle.height = y2-y1 + 'px';
					vm.sFrameStyle.width = x2-x1 + 'px';
					vm.sFrameStyle.top = y1 + 'px';
					vm.sFrameStyle.left = x1 + 'px';
					vm.sFrameStyle.visibility = 'visible';
				});
				
			});	
			$document.on('mouseup', function(){
				console.log('up');
				
				var upCoords = coords(e);
				
				var x1 = startCoords.x,
					y1 = startCoords.y,
					x2 = upCoords.x,
					y2 = upCoords.y;
				
				if (x1 > x2){
					x1 = x1+x2;
					x2 = x1-x2;
					x1 = x1-x2;
				}
				if (y1 > y2){
					y1 = y1+y2;
					y2 = y1-y2;
					y1 = y1-y2;
				}
				
				//if(x1 != x2 || y1 != y2)
					//doSelection(x1,y1,x2,y2);
				$scope.$apply(function(){
					vm.sFrameStyle.visibility = 'hidden';
				});
				
				$document.off('mousemove');
				$document.off('mouseup');
			});	
		};
		vm.addCircle = function(){
			vm.figures.push({
				type: 'circle',
				id: random.getRandom(), 
				scope: null	
			});
		};
		vm.addRectangle = function(){
			vm.figures.push({
				type: 'rectangle',
				id: random.getRandom(), 
				scope: null
			});
		};
		vm.delete = function(){};
		vm.clear = function(){
			vm.figures = [];
		};
		vm.group = function(){};
		vm.ungroup = function(){};
		vm.save = function(){};

	};
	
	
	angular
		.module("cafeClientApp")
		.controller("workTableCtrl", ['$scope', '$document', 'random', workTableCtrl]);
})();