(function(){
	var authentication = function($window, $http){
		var saveToken = function(token){
			console.log(token);
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
		
		var isLoggedIn = function(){
			var token = getToken();
			
			if(token && token!=='undefined'){
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now() / 1000;
			} else {
				return false;
			}
		}
	
		
		var currentUser = function(){
			if(isLoggedIn()){
				var token = getToken();
				
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return {
					email: payload.email,
					name: payload.name,
					_id: payload._id
				};
			}
		};
		
		var deleteUser = function(){
			if(isLoggedIn()){
				return $http.delete('/api/user', {
					headers: {
						Authorization: 'Bearer ' + getToken()
					}
				});
			}
		}
		
		var getUserInfo = function(){
			return $http.get('/api/user', {
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
			getUserInfo: getUserInfo
		};
	}
	
	angular.module('cafeClientApp')
		.service('authentication', ['$window','$http',authentication]);
})();