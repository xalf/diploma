(function(){
	var workTableService = function($http, authentication){
		var getWorkTableInfo = function(cafeid){
			return $http.get('/api/cafe/' + cafeid + '/workTable');
		}; 
		
		var getOrdersInfo = function(cafeid){
			return $http.get('/api/cafe/' + cafeid + '/orders');
		};
		
		var updateTablesList = function(cafeid, data){
			if(authentication.isLoggedIn('admin'))
				return $http.post('/api/cafe/' + cafeid + '/table', data, {
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				});
		};
		
		var createOrder = function(data){
			if(authentication.isLoggedIn('client'))
				return $http.post('/api/user/client/order', data, {
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				})
		};
		
		return{
			getWorkTableInfo: getWorkTableInfo,
			getOrdersInfo: getOrdersInfo,
			updateTablesList: updateTablesList,
			createOrder: createOrder
		};
	}

	angular.module('cafeClientApp')
		.service('workTableService', ['$http', 'authentication', workTableService]);
})();