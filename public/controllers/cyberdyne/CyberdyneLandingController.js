var app = angular.module('app');


app.controller('CyberdyneLandingController', function($scope, Base64) {
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
		  	console.log(response);
		  	//window.location.replace("/cyberdyne/core");
		  },
		  error: function() {
		  	console.log("err");
		  }
		});
	};

});