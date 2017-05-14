(function(){
	var cafeData = function($http, authentication){
		var getCafeList = function(){
			return $http.get('/api/cafe');
		};
		
		var getCafeById = function(cafeid){
			return $http.get('/api/cafe/'+cafeid);
		};
		
		var addReviewById = function(cafeid, data){
			return $http.post('/api/cafe/'+cafeid+'/reviews', data,{
				headers: {
					Authorization: 'Bearer '+authentication.getToken()
				}
			});
		};
		
		var deleteReviewById = function(cafeid, reviewid){
			return $http.delete('/api/cafe/' + cafeid + '/reviews/' + reviewid, {
				headers: {
					Authorization: 'Bearer '+authentication.getToken()
				}
			});
		};
		
		var addCafe = function(data){
			if(authentication.isLoggedIn('admin'))
				return $http.post('/api/cafe', data,{
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				});
		};
		
		var deleteCafe = function(cafeid){
			if(authentication.isLoggedIn('admin'))
				return $http.delete('/api/cafe/' + cafeid, {
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				});
		};
		
		var updateCafe = function(cafeid, data){
			if(authentication.isLoggedIn('admin'))
				return $http.put('/api/cafe/' + cafeid, data,{
					headers: {
						Authorization: 'Bearer '+authentication.getToken()
					}
				});
		};
		
		return{
			getCafeList: getCafeList,
			getCafeById: getCafeById,
			addReviewById: addReviewById,
			deleteReviewById: deleteReviewById,
			updateCafe: updateCafe,
			deleteCafe: deleteCafe,
			addCafe: addCafe
		};
	}

	angular.module('cafeClientApp')
		.service('cafeData', ['$http','authentication',cafeData]);
})();