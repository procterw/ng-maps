// Main application. Reads in dependencies and handles configuration

var app = angular.module('App', ['ngRoute', 'ngAnimate', 'ui.slider', 'ngMaps', 'ngSanitize'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

	$routeProvider.

	when('/map', {
		templateUrl: 'templates/map.html'
	}).
    when('/marker', {
        templateUrl: 'templates/marker.html'
    }).
    when('/points', {
        templateUrl: 'templates/points.html'
    }).
    when('/geopoints', {
        templateUrl: 'templates/geopoints.html'
    }).
    when('/geopolygons', {
        templateUrl: 'templates/geopolygons.html'
    }).
    when('/polygons', {
        templateUrl: 'templates/polygons.html'
    }).
    otherwise({
        redirectTo: '/map'
    });


  // This allows for non hash url parameters to be read 
  // $locationProvider.html5Mode(true);

}]);
