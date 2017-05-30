(function(){
var workTableCtrl = function($scope, $document, $uibModal, random, coordsService, authentication, workTableService){
	var vm = this;
	vm.figures = [];
	vm.focusObj = null;
	var cafeid;

	var areaPosition = new coordsService('#objects-area');
	var Figure = function(type){
		this.index;
		this.numberOfSeats = 0;
		this.type = type;
		this.classes = [type, 'fig'];
		this.id = random.getRandom();
		this.shiftX = 0;
		this.shiftY = 0;
		this.isFocus = false;
		this.style =  {
			height: 50,
			width: 50,
			top: 0,
			left: 0
		};
		this.htmlElm = null;
	};
	var FigureProto = function(){
		this.resize = function(obj){
			var that = this;
			var x1 = this.style.left,
				x2 = this.style.left + this.style.width,
				y1 = this.style.top,
				y2 = this.style.top + this.style.height;

			$scope.$apply(function(){
				if(obj.x2 !== undefined && obj.x2 > x1){
					that.style.width = obj.x2 - x1;
				}
				if(obj.x1 !== undefined && obj.x1 < x2){
					that.style.width += x1 - obj.x1; 
					that.style.left = obj.x1;
				}
				if(obj.y2 !== undefined && obj.y2 > y1){
					that.style.height = obj.y2 - y1;
				}
				if(obj.y1 !== undefined && obj.y1 < y2){
					that.style.height += y1 - obj.y1;
					that.style.top = obj.y1;
				}
			});
		};
		this.mousedown = function($event){
			$event.stopPropagation();
			changeFocus(this);

			vm.focusObj = this;

			areaPosition.update();
			var figurePosition = new coordsService($event.target, areaPosition);

			var downCoords = coords($event);
			this.shiftY = downCoords.y - figurePosition.y;
			this.shiftX = downCoords.x - figurePosition.x;
			this.htmlElm = angular.element($event.srcElement);

			this.htmlElm.on('ondragstart', function(){
				return false;
			});

			var that = this;

			$document.on('mousemove', function(e){
				var moveCoords = coords(e);

				$scope.$apply(function(){
					that.style.top = moveCoords.y - that.shiftY;
					that.style.left = moveCoords.x - that.shiftX;
				});
			});

			this.htmlElm.on('mouseup', function(e){
				that.htmlElm.off('mouseup');
				$document.off('mousemove');
			});
		};
		this.delete = function(){

		};
		this.isInSelect = function(x1,y1,x2,y2){
			return this.style.left > x1 && 
			   this.style.left + this.style.width < x2 && 
			   this.style.top > y1 && 
			   this.style.top + this.style.height < y2;
		};
		this.setFocus = function(flag){
			flag ? this.classes[1] = 'focus-figure' : this.classes[1] = undefined;
		}
	}
	Figure.prototype = new FigureProto();
	Figure.prototype.constructor = Figure;

	var coords = function(e){
		return {
			x: e.pageX - areaPosition.x,
			y: e.pageY - areaPosition.y
		};
	};
	function doSelection(x1,y1,x2,y2){

		vm.focusObj.setArea(x1,y1,x2,y2);

		for(var i = 0; i < vm.figures.length; i++){
			if(vm.figures[i].isInSelect(x1,y1,x2,y2)){
				$scope.$apply(function(){
					vm.sFrame.addChild(vm.figures[i]);
					vm.figures.splice(i, 1);
					i--;
				});
			}
		}
		vm.focusObj.setFocus(true);
	}
	vm.workTableImg = {};
	vm.sFrame = {
		sFrameStyle: {
			height: 0,
			width: 0,
			top: 0,
			left: 0
		},
		classes: "",
		children: [],
		htmlElem: null,
		shiftY: 0,
		shiftX: 0,
		deleteChild: function(){
			for(key in this.children){
				this.children[key].style.left += this.sFrameStyle.left;
				this.children[key].style.top += this.sFrameStyle.top;
				vm.figures.push(this.children[key]);
			}
			this.children = [];
		},
		addChild: function(child){
			vm.sFrame.children.push(child);
			child.style.left -= this.sFrameStyle.left;
			child.style.top -= this.sFrameStyle.top;
		},
		setArea: function(x1, y1, x2, y2){
			$scope.$apply(function(){
				vm.sFrame.sFrameStyle.height = y2-y1;
				vm.sFrame.sFrameStyle.width = x2-x1;
				vm.sFrame.sFrameStyle.top = y1;
				vm.sFrame.sFrameStyle.left = x1;
			});
		},
		setFocus: function(flag){
			flag ? this.classes = 'show' : this.classes = '';	

		},
		delete: function(){
			this.deleteChild();
			this.setFocus(false);
		},
		mousedown: function($event){
			$event.stopPropagation();

			areaPosition.update();
			var sFramePosition = new coordsService($event.srcElement, areaPosition);

			var downCoords = coords($event);
			this.shiftY = downCoords.y - sFramePosition.y;
			this.shiftX = downCoords.x - sFramePosition.x;
			this.htmlElm = angular.element($event.srcElement);

			this.htmlElm.on('ondragstart', function(){
				return false;
			});

			var that = this;

			$document.on('mousemove', function(e){
				var moveCoords = coords(e);

				$scope.$apply(function(){
					that.sFrameStyle.top = moveCoords.y - that.shiftY;
					that.sFrameStyle.left = moveCoords.x - that.shiftX;
				});
			});

			this.htmlElm.on('mouseup', function(e){
				that.htmlElm.off('mouseup');
				$document.off('mousemove');
			});
		} 
	};
	authentication.getAdminInfo().then(function(data){
		cafeid = data.data.cafeid;

		workTableService
			.getWorkTableInfo(cafeid)
			.then(function(data){
				var img = new Image();
				img.src = data.data.workTableImg;
				img.onload = function(){
					vm.workTableImg = {
						'background-image': 'url("' + img.src + '")',
						width: img.width + 'px',
						height: img.height + 'px'
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
				}
			}, function(e){
				console.log(e);
			});
		}, function(e){
			console.log(e);
		});

	vm.workTableImg = {}; 
	
	vm.error = false;
	vm.success = false;

	vm.workTableMousedown = function(e){ 
		vm.sFrame.sFrameStyle.height = 0;
		vm.sFrame.sFrameStyle.width = 0;
		changeFocus(vm.sFrame);
		areaPosition.update();
		var startCoords = coords(e);


		$document.on('mousemove', function(e){
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

			vm.sFrame.setArea(x1, y1, x2, y2);

		});	
		$document.on('mouseup', function(e){
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

			if(x1 != x2 || y1 != y2)
				doSelection(x1,y1,x2,y2);

			$document.off('mousemove');
			$document.off('mouseup');
		});	
	};
	vm.addCircle = function(){
		createFigure('circle');
	};
	vm.addRectangle = function(){
		createFigure('rectangle');
	};
	vm.delete = function(){
		if(vm.focusObj === null) return;
		if(vm.focusObj === vm.sFrame){
			vm.sFrame.children = [];
			vm.sFrame.delete();
			vm.focusObj = null;
		} else {
			for(i in vm.figures)
				if(vm.figures[i] === vm.focusObj){
					vm.figures.splice(i, 1);
				}
		}
	};
	vm.clear = function(){
		vm.figures = [];
		vm.focusObj = null;
		vm.sFrame.children = [];
		vm.sFrame.setFocus(false);
	};
	vm.setImage = function(){
		var modalUpdate = $uibModal.open({
			templateUrl: '/setImageWorkTable/setImageWorkTable.view.html',
			controller: 'setImageWorkTableCtrl as vm',
			resolve: {
				cafeid: function(){
					return cafeid;			  
				}
			}
		});
		modalUpdate.result.then(function(data){
			var img = new Image();
			img.src = data.workTableImg;
			img.onload = function(){
				$scope.$apply(function(){
					vm.workTableImg = {
						'background-image': 'url("' + img.src + '")',
						width: img.width + 'px',
						height: img.height + 'px'
					};
				});
				
			}
		});
	};
	vm.save = function(){
		vm.error = false;
		vm.success = false;
		var resObj = [];
		
		vm.figures.forEach(function(item, i, arr){
			if(!item.index && !vm.isUnique(item) && item.numberOfSeats <= 0){
				vm.error = true;
				return;
			}
			var fig = {
				number: item.index,
				numberOfSeats: item.numberOfSeats,
				x: item.style.left,
				y: item.style.top,
				height: item.style.height,
				width: item.style.width,
				type: item.type,
				cafeid: cafeid
			};
			resObj.push(fig);
		});
		if(!vm.error)
			workTableService.updateTablesList(cafeid, resObj)
			.then(function(data){vm.success = true;}, function(e){console.log(e);});
	};
	vm.resize = function(figure, $event, param1, param2){
		$event.stopPropagation();
		changeFocus(figure);

		$document.on('mousemove', function(e){
			var obj = {};
			var moveCoords = coords(e);

			obj = setParam(obj, param1, moveCoords);
			if (param2 !== undefined)
				obj = setParam(obj, param2, moveCoords);
			vm.focusObj.resize(obj);
		});
	};
	vm.del = function(){
		$document.off('mousemove');
	};
	var changeFocus = function(obj){
		if(vm.focusObj != undefined){
			vm.focusObj.setFocus(false);
			vm.focusObj.delete();
		}
		vm.focusObj = obj;
		vm.focusObj.setFocus(true);
	};
	var createFigure = function(type){
		var fig = new Figure(type);
		fig.index = vm.figures.length + 1;
		vm.figures.push(fig);
	};
	vm.isUnique = function(obj){
		for(i in vm.figures)
			if (obj.index === vm.figures[i].index && obj !== vm.figures[i])
				return false;
		return true;
	};
};



var setParam= function(obj, param, e){
	if (param === 'x1' || param === 'x2')
		obj[param] = e.x;
	else 
		obj[param] = e.y;

	return obj;
}
var formatStyle = function(){
	return function(obj){
		var newObj = {};
		for (key in obj) {
			newObj[key] = obj[key] + 'px';
		}
		return newObj;
	}
};

angular
	.module("cafeClientApp")
	.controller("workTableCtrl", ['$scope', '$document', '$uibModal', 'random', 'coordsService', 'authentication', 'workTableService', workTableCtrl])
	.filter('formatStyle', formatStyle);
})();