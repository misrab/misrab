var app = angular.module('app');


app.controller('CyberdyneLandingController', function($location, $rootScope, $scope, 
	$cookieStore, Base64, GenericService) {
	init();

	function init() {
		$scope.enterPassword = enterPassword;

	};

	
	function enterPassword() {
		var data = {};
		data.password = Base64.encode($('input[type="password"]').val());

		$.ajax({
		  type: "POST",
		  url: '/cyberdyne/api/v1/password',
		  data: data,
		  success: function(response) {
		  	if (!response) return;
		  	if (response.success === true) {
		  		// this doens't work inside a 
		  		// separate function
		  		$cookieStore.put("key", response.key);
		  		$rootScope.setHttpBasicHeaders();
		  		$location.url("/cyberdyne/core");
		  	} else {
		  		GenericService.alert('danger', 'You have entered an incorrect password. This incident has been reported.');
		  	}
		  },
		  error: function() {
		  	GenericService.alert('danger', 'You have entered an incorrect password. This incident has been reported.');
		  }
		});
	};

});