(function(){
	var today = moment();
	
	var dateFilter = function(){
		return function(obj, flag){
			if(!obj)
				return;
			var resObj = [];
			obj.forEach(function(item, i , arr){
				if(flag === undefined){
					if(today.isSame(item.date, 'day'))
						resObj.push(item);
					return;
				}
				if(flag){
					if(today.isBefore(item.date) || today.isSame(item.date, 'day'))
						resObj.push(item);
				} else {
					if(today.isAfter(item.date) && !today.isSame(item.date, 'day'))
						resObj.push(item);
				}
			});
			return resObj;
		}
	};
	
	angular
	.module("cafeClientApp")
	.filter('dateFilter', dateFilter);
})();