// Main application. Reads in dependencies and handles configuration

var app = angular.module('App', ['ngRoute', 'ngAnimate', 'ui.slider', 'ngMaps', 'ngSanitize'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

	$routeProvider.

    when('/examples', {
        templateUrl: 'templates/examples.html'
    }).
	// when('/examples/map', {
	// 	templateUrl: 'templates/map.html'
	// }).
 //    when('/examples/marker', {
 //        templateUrl: 'templates/marker.html'
 //    }).
 //    when('/examples/points', {
 //        templateUrl: 'templates/points.html'
 //    }).
 //    when('/examples/geopoints', {
 //        templateUrl: 'templates/geopoints.html'
 //    }).
 //    when('/examples/geopolygons', {
 //        templateUrl: 'templates/geopolygons.html'
 //    }).
 //    when('/examples/polygons', {
 //        templateUrl: 'templates/polygons.html'
 //    }).
 //    when('/examples/polylines', {
 //        templateUrl: 'templates/polylines.html'
 //    }).
 //    when('/examples/circles', {
 //        templateUrl: 'templates/circles.html'
 //    }).
 //    when('/examples/rectangles', {
 //        templateUrl: 'templates/rectangles.html'
 //    }).
 //    when('/examples/overlay', {
 //        templateUrl: 'templates/overlay.html'
 //    }).
 //    when('/examples/control', {
 //        templateUrl: 'templates/control.html'
 //    }).
 //    when('/examples/infowindow', {
 //        templateUrl: 'templates/infowindow.html'
 //    }).
    when('/documentation', {
        templateUrl: 'templates/documentation.html'
    }).
    otherwise({
        redirectTo: '/'
    });


  // This allows for non hash url parameters to be read 
  // $locationProvider.html5Mode(true);

}]);
