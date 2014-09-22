var app = angular.module('app');


app.controller('PersonalLandingController', function($scope) {
	init();

	function init() {
		scrollers();
	};



	function scrollToDiv(id) {
		$('html, body').animate({
        	scrollTop: $(id).offset().top
    	}, 1000);
	};
	function scrollers() {
		$('.nav_projects').click(function() {
			scrollToDiv('#projects');
		});
		$('.nav_blog').click(function() {
			scrollToDiv('#blog');
		});
	};
	
});