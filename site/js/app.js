// Main application. Reads in dependencies and handles configuration

var app = angular.module('App', ['ngRoute', 'ngAnimate', 'ngMaps'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

	$routeProvider.

    when('/', {
        templateUrl: 'templates/main.html'
    }).
    when('/examples', {
        templateUrl: 'templates/examples.html'
    }).
    when('/documentation', {
        templateUrl: 'templates/documentation.html'
    }).
    otherwise({
        redirectTo: '/'
    });


  // This allows for non hash url parameters to be read 
  // $locationProvider.html5Mode(true);

}]);
