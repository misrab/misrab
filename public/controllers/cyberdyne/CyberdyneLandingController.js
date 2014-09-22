var app = angular.module('app');


app.controller('CyberdyneLandingController', function($location, $rootScope, $scope, 
	$cookieStore, Base64) {
	init();

	function init() {
		$scope.enterPassword = enterPassword;

	};

	// shows alert warning for a moment
	function alert() {
		var spot = $('.alert-danger');
		spot.slideDown();
		setTimeout(function() {
			spot.slideUp();
		}, 3000);
	}
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
		  		alert();
		  	}
		  },
		  error: function() {
		  	alert();
		  }
		});
	};

});