var app = angular.module('app', [
	'ngRoute',
	'ngCookies',
  //'d3',
  //'hljs' // syntax highlighting in landing.html
  //'http-auth-interceptor',
	// 'angularFileUpload'
]);


// directive for ng-enter on enter button press
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
    	element.bind("keydown keypress", function (event) {
        //element.bind("keydown keypress", function (event) {
            if(event.which === 13) { 
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  // public routes
  .when('/', {
    templateUrl:  '/views/personal/landing.html',
    controller:   "PersonalLandingController" 
  })
  // /blog/:id
  // /fun
  // also resume, each project link should be fine...

  // admin routes
  // admin landing/login
  .when('/admin', {
    templateUrl:  '/views/admin/landing.html',
    controller:   "AdminLandingController" 
  })
  // admin core
  .when('/admin/core', {
    templateUrl:  '/views/admin/core.html',
    controller:   "AdminCoreController" 
  })  
  // admin for misrab.me
  // '/admin/misrab'

  // captain's log
  //

  // notetaking

  .otherwise({
    templateUrl: '/views/admin/landing.html'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});