angular.module('App')
	.controller('Main', ['$scope', '$location', function($scope, $location){

		$scope.location = function() {
			return $location.path();
		};

		$scope.options = [
			"map",
			"marker",
			"points",
			"geopoints",
			"polygons",
			"geopolygons",
			"polylines",
			"circles",
			"rectangles",
			"overlay",
			"control",
			"infowindow"
		];

	}]);