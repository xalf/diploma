(function(){
var orderTableCtrl = function($scope, $routeParams, coordsService, authentication, workTableService, cafeData){
	var vm = this;
	
	var minutesToDate = function(minutes, date){
		var hour = Math.floor(minutes / 60);
		var minute = minutes - (hour * 60);

		date.setMinutes(minute);
		date.setHours(hour);

		return date;
	};
	var dateToMinutes = function(date){
		var minutes = date.getHours() * 60 + date.getMinutes();

		return minutes;
	};
	var inTime = function(){
		for(i in vm.figures){
			var date = vm.order.date;
			vm.figures[i].orders.forEach(function(item){
				if(item.date.getMonth() === date.getMonth() 
				  && item.date.getDate() === date.getDate()){
					if((dateToMinutes(item.date) < dateToMinutes(vm.order.start) 
						&& dateToMinutes(item.dateEnd) < dateToMinutes(vm.order.start))
					   ||(dateToMinutes(item.date) > dateToMinutes(vm.order.end) 
						  && dateToMinutes(item.dateEnd) > dateToMinutes(vm.order.end)))
						vm.figures[i].active = true;
					else
						vm.figures[i].active = false;
				}
			});
		}

	};	
	var today = new Date();
	vm.order = {};
	vm.order.date = today;
	
	var user = authentication.currentUser();
	
	cafeData.getCafeById($routeParams.cafeid).then(function(data){
		vm.timetable = data.data.timetable;
		console.log('vm.timetable');
		console.log(vm.timetable);
		
		$scope.dateOptions = {
			dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			//maxDate: new Date(today.getYear(), today.getMonth() + 2, today.getDate()),
			minDate: today,
			startingDay: 1
		  };

		  function disabled(data) {
			var date = data.date,
			    mode = data.mode;
			  for(i in vm.timetable) {
				  if(!vm.timetable[i].isChoice && vm.timetable[i].number === date.getDay())
					  return mode === 'day';
			  }
			return false;
		  }
		
		vm.order.start = new Date(vm.timetable[today.getDay()].openTime);
		vm.order.end = new Date(vm.timetable[today.getDay()].closeTime);
						
		$( "#slider-range" ).slider({
		  range: true,
		  min: dateToMinutes(vm.order.start),
		  max: dateToMinutes(vm.order.end),
		  values: [ dateToMinutes(vm.order.start), dateToMinutes(vm.order.end) ],
		  slide: function( event, ui ) {
			  $scope.$apply(function(){
				  vm.order.start = minutesToDate(ui.values[ 0 ], vm.order.start);
				  vm.order.end = minutesToDate(ui.values[ 1 ], vm.order.end);
			  });
			  inTime();
		  }
		});
		$scope.$watch('otvm.order.date', function(){
			var day = vm.order.date.getDay();
			var open = new Date(vm.timetable[day].openTime);
			var close = new Date(vm.timetable[day].closeTime);
			$( "#slider-range" ).slider( "option", "max", dateToMinutes(close));
			$( "#slider-range" ).slider( "option", "min", dateToMinutes(open));
			var values = $( "#slider-range" ).slider( "option", "values" );
			if(values[0] < dateToMinutes(open)){
				$( "#slider-range" ).slider( "option", "values", [dateToMinutes(open), values[1]]);
				vm.order.start = open;
			}
			values = $( "#slider-range" ).slider( "option", "values" );
			if(values[1] > dateToMinutes(close)){
				$( "#slider-range" ).slider( "option", "values", [values[0], dateToMinutes(close)]);
				vm.order.end = close;
			}
			inTime();
		});
	}, function(e){
		vm.message = "Что-то пошло не так";
	});

  $scope.open = function() {
    $scope.popup.opened = true;
  };

  $scope.popup = {
    opened: false
  };
	
	vm.order = {};
	vm.figures = [];
	var cafeid;
	vm.workTableImg = {};
	var Figure = function(type){
		this.index;
		this.active = true;
		this.orders = [];
		this.numberOfSeats = 0;
		this.type = type;
		this.style =  {
			height: 50,
			width: 50,
			top: 0,
			left: 0
		};
	};
	
	vm.selectionTable = function(figure){
		if(figure.active){
			vm.order.table = figure;
		}
	};
	
	vm.onSubmit = function(){
		var start = vm.order.date,
			stop = vm.order.date;
		
		start.setHours(vm.order.start.getHours());
		start.setMinutes(vm.order.start.getMinutes());
		stop.setHours(vm.order.end.getHours());
		stop.setMinutes(vm.order.end.getMinutes());
		
		var reqObj = {
			cafeid: $routeParams.cafeid,
			dateEnd: stop,
			date: start,
			tableNumber: vm.order.table.index,
			clientid: user._id
		};
		workTableService.createOrder(reqObj).then(function(data){
			
		});
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
		
			workTableService
				.getOrdersInfo($routeParams.cafeid)
				.then(function(res){
				console.log(res.data);
					vm.figures.forEach(function(item, i, arr){
						var number = item.index;
						for(j in res.data){
							if(number == res.data[j].tableNumber){
								item.orders.push({
									date: new Date(res.data[j].date),
									dateEnd: new Date(res.data[j].dateEnd)
								});
							}
						}
					});
					inTime();	
				}, function(e){
					console.log(e);
				});
		}, function(e){
			console.log(e);
		});
	
	
};
	
angular
	.module("cafeClientApp")
	.controller("orderTableCtrl", ['$scope', '$routeParams', 'coordsService', 'authentication', 'workTableService', 'cafeData', orderTableCtrl]);
})();