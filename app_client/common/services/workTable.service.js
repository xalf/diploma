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
		
		var getOrderByCafeId = function(cafeid){
			if(authentication.isLoggedIn('admin'))
				return $http.get('/api/user/admin/' + cafeid, {
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				})
		};
		
		var getOrderByClientId = function(clientid){
			if(authentication.isLoggedIn('client'))
				return $http.get('/api/user/client/' + clientid,  {
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				})
		};
		
		var deleteOrder = function(orderid){
			if(authentication.isLoggedIn('client'))
				return $http.delete('/api/user/client/order/' + orderid,  {
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				})
		};
		
		return{
			getWorkTableInfo: getWorkTableInfo,
			getOrdersInfo: getOrdersInfo,
			updateTablesList: updateTablesList,
			createOrder: createOrder,
			getOrderByClientId: getOrderByClientId,
			getOrderByCafeId: getOrderByCafeId,
			deleteOrder: deleteOrder
		};
	}

	angular.module('cafeClientApp')
		.service('workTableService', ['$http', 'authentication', workTableService]);
})();