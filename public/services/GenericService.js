var app = angular.module('app');

app.service('GenericService', function() {
	// shows alert warning for a moment
	// this.alert = function(type) {
	// 	var spot = $('.alert-danger');
	// 	spot.slideDown();
	// 	setTimeout(function() {
	// 		spot.slideUp();
	// 	}, 3000);

	this.alert = function(type, msg) {
		if (!type) return;

		if (!msg) {
			switch(type) {
				case "danger":
					msg = "Something went wrong";
					break;
				case "warning":
					msg = "Warning";
					break;
				case "success":
					msg = "Successful";
					break;
				default:
					"";
			}
		}

		var select = ".alert-" + type;
		var spot = $(select);
		spot.html(msg);
		spot.slideDown();
		setTimeout(function() {
			spot.slideUp();
		}, 3000);
	};
});