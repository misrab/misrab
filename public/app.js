var app = angular.module('app', [
	'ngRoute',
	'ngCookies',
  //'d3',
  //'hljs' // syntax highlighting in landing.html
  'http-auth-interceptor'
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

app.config(function($routeProvider, $locationProvider, $httpProvider) {
  $locationProvider.html5Mode(true);


  $routeProvider
    .when('/', {
      templateUrl:  '/views/personal/landing.html',
      controller:   "PersonalLandingController",
      requireLogin: false
    })
    .when('/cyberdyne', {
      templateUrl:  '/views/cyberdyne/landing.html',
      controller:   "CyberdyneLandingController" ,
      requireLogin: false
    })
    .when('/cyberdyne/core', {
      templateUrl:  '/views/cyberdyne/core.html',
      controller:   "CyberdyneCoreController",
      requireLogin: true
    })  
    .otherwise({ redirectTo: '/' });



  // 401 handling
  var logsOutUserOn401 = ['$q', '$location', function ($q, $location) {
    var success = function (response) {
      return response;
    };

    var error = function (response) {
      if (response.status === 401) {
        // display error
        // $('.alert-danger').html('Invalid username or password');
        // $('.alert-danger').show();
        
      //redirect them back to login page
      $location.path('/');

      return $q.reject(response);
      } 
      else {
      return $q.reject(response);
      }
    };

    return function (promise) {
      return promise.then(success, error);
    };
  }];

  // var setAuthHeader = ["$rootScope", "$cookieStore", "Base64", function($rootScope, $cookieStore, Base64) {
  //   $rootScope.key = $cookieStore.get("key") || null;
  //   if ($rootScope.key) {
  //     var encoded = Base64.encode($rootScope.key);
  //     $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
  //   } else {
  //     $http.defaults.headers.common.Authorization = 'Basic ';
  //   }
  // }];

  // configure html5 to get links working on jsfiddle
  $httpProvider.responseInterceptors.push(logsOutUserOn401);
  // $httpProvider.interceptors.push(setAuthHeader);
});


app.run(function($rootScope, $location, $cookieStore, $http, Base64) {

  // Everytime the route in our app changes check auth status
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    $rootScope.key = $cookieStore.get("key") || null;
    // if ($rootScope.key) {
    //   var encoded = Base64.encode($rootScope.key);
    //   $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
    // } else {
    //   $http.defaults.headers.common.Authorization = 'Basic ';
    // }
    
    if (next.requireLogin && !$rootScope.key) {
      // clear cookie just in case mismatch
      $cookieStore.remove('key');
      
      $location.path('/');
      event.preventDefault();
    }
    // send to workspace if logged in and not in generic page
    else if (!next.requireLogin && $rootScope.key) {
      $location.path('/cyberdyne/core');
      event.preventDefault();
    }
  });
});