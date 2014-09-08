var app = angular.module('app');


app.controller('CyberdyneLandingController', function($scope) {
	init();

	function init() {
		$scope.enterPassword = enterPassword;
	};


	function enterPassword() {
		var data = {};
		data.password = $('input[type="password"]').val();

		$.ajax({
		  type: "POST",
		  url: '/cyberdyne/api/v1/password',
		  data: data,
		  success: function(response) {
		  	window.location.replace("/cyberdyne/core");
		  },
		  error: function() {
		  	console.log("err");
		  }
		});
	};

});