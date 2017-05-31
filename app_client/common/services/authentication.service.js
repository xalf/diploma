(function(){
	var authentication = function($window, $http){
		var saveToken = function(token){
			$window.localStorage['token'] = token;
		}
		
		var getToken = function(){
			return $window.localStorage['token'];
		}
		
		var login = function(user){
			return $http.post('/api/user/login', user)
				.then(function(data){
					saveToken(data.data.token);
				});
		}
		
		var register = function(user){
			return $http.post('/api/user/register', user)
				.then(function(data){
					saveToken(data.data.token);
				});
		}
		
		var logout = function(){
			$window.localStorage.removeItem('token');
		}
		
		var getInfoByToken = function(token){
			return JSON.parse($window.atob(token.split('.')[1]));
		} 
		
		var isLoggedIn = function(type){
			var token = getToken();
			
			if(token && token!=='undefined'){
				var payload = getInfoByToken(token);
				if(type === payload.type)
					return payload.exp > Date.now() / 1000;
				else
					return false;
			} else {
				return false;
			}
		}
	
		
		var currentUser = function(){
			var token = getToken();
			if(token && token!=='undefined'){
				var payload = getInfoByToken(token);
				if(isLoggedIn(payload.type)){
					return {
						type: payload.type,
						email: payload.email,
						name: payload.name,
						_id: payload._id
					};
				}
			}
		};
		
		var deleteUser = function(){
			var token = getToken();
			var payload = getInfoByToken(token);
			if(isLoggedIn(payload.type)){
				return $http.delete('/api/user', {
					headers: {
						Authorization: 'Bearer ' + getToken()
					}
				});
			}
		}
		
		var getUserInfo = function(){
			return $http.get('/api/user/client', {
					headers: {
						Authorization: 'Bearer ' + getToken()
					}
				});
		};
		
		var getAdminInfo = function(){
			return $http.get('/api/user/admin', {
					headers: {
						Authorization: 'Bearer ' + getToken()
					}
				});
		};
		
		return {
			saveToken: saveToken,
			getToken: getToken,
			login: login,
			register: register,
			logout: logout,
			isLoggedIn: isLoggedIn,
			currentUser: currentUser,
			deleteUser: deleteUser,
			getUserInfo: getUserInfo,
			getAdminInfo: getAdminInfo
		};
	}
	
	angular.module('cafeClientApp')
		.service('authentication', ['$window','$http',authentication]);
})();