var app = angular.module('app');


app.controller('AppController', function($location, $http, $rootScope, 
$cookieStore, Base64) {
	
	init();

	function init() {
		$rootScope.logout = logout;
		$rootScope.setHttpBasicHeaders = setHttpBasicHeaders;
		setHttpBasicHeaders();

		// if ($rootScope.key) {
		// 	$location.url('/cyberdyne/core');
		// } else {
		// 	$location.url('/cyberdyne');
		// }
	};


	function setHttpBasicHeaders() {
		var key = $cookieStore.get("key");

		if (key === undefined || key === null) {
			$http.defaults.headers.common.Authorization = 'Basic ';
		} else {
			var encoded = Base64.encode(key);
			$http.defaults.headers.common.Authorization = 'Basic ' + encoded;
		}
	};
	function logout() {
		$cookieStore.remove("key");
		$http.defaults.headers.common.Authorization = 'Basic ';
		$location.url('/cyberdyne');
	};

});