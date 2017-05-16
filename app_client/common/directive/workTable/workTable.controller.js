(function(){
	var workTableCtrl = function($scope, $document, $uibModal, random, coordsService, authentication){
		var vm = this;
		vm.figures = [];
		vm.focusObj = null;
		var areaPosition = new coordsService('#objects-area');
		var Figure = function(type){
			this.classes = [type];
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
			this.mousedown = function($event){
				$event.stopPropagation();
				if(vm.focusObj !== null){
					vm.focusObj.delete();
					vm.focusObj = null;
				} 
				this.setFocus(true);
				vm.focusObj = this;
				
				areaPosition.update();
				var figurePosition = new coordsService($event.srcElement, areaPosition);

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
			vm.focusObj = vm.sFrame;
			vm.focusObj.setArea(x1,y1,x2,y2);
			
			for(var i = 0; i < vm.figures.length; i++){
				if(vm.figures[i].isInSelect(x1,y1,x2,y2)){
					//vm.focusObj.addChild(vm.figures[key]);
					$scope.$apply(function(){
						vm.sFrame.addChild(vm.figures[i]);
						vm.figures.splice(i, 1);
						i--;
					});
				}
			}
			vm.focusObj.setFocus(true);
		}
		
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
		vm.workTableImg = {};
		
		vm.workTableMousedown = function(e){
			if(vm.focusObj !== null){
				vm.focusObj.delete();
				vm.focusObj = null;
			} 
			vm.sFrame.sFrameStyle.height = 0;
			vm.sFrame.sFrameStyle.width = 0;
			vm.sFrame.setFocus(true);
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
			vm.figures.push(new Figure('circle'));
		};
		vm.addRectangle = function(){
			vm.figures.push(new Figure('rectangle'));
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
			authentication.getAdminInfo().then(function(data){
				var cafeid = data.data.cafeid;
				
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
					vm.workTableImg = {
						'background-image': 'url("' + data.workTableImg + '")'
					};
				});
			});
		};
		vm.save = function(){};
	};
	
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
		.controller("workTableCtrl", ['$scope', '$document', '$uibModal', 'random', 'coordsService', 'authentication', workTableCtrl])
		.filter('formatStyle', formatStyle);
})();