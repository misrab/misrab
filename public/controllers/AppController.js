var app = angular.module('app');


app.controller('AppController', function($location, $http, $rootScope, 
$cookieStore, Base64) {
	
	init();

	function init() {
		$rootScope.logout = logout;
		$rootScope.setHttpBasicHeaders = setHttpBasicHeaders;
		setHttpBasicHeaders();

		// $http({method: 'GET', url: '/lala'})
		//   .success(function(data, status, headers, config) {
		//     // this callback will be called asynchronously
		//     // when the response is available
		//     console.log("auth header was: " + String(data));
		//   });
	};


	function setHttpBasicHeaders() {
		var key = $cookieStore.get("key");

		if (key === undefined || key === null) {
			//$http.defaults.headers.common.Authorization
			$http.defaults.headers.common.Authorization = 'Basic ';
		} else {
			var encoded = Base64.encode(key);
			//$http.defaults.headers.common.Authorization 
			$http.defaults.headers.common.Authorization = 'Basic ' + encoded;
		}
	};
	function logout() {
		$cookieStore.remove("key");
		$http.defaults.headers.common.Authorization = 'Basic ';
		$location.url('/');
	};

});