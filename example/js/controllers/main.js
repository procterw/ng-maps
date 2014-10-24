angular.module('App')
	.controller('Main', ['$scope', '$location', function($scope, $location){

		$scope.location = function() {
			return $location.path();
		};

		$scope.options = [
			"map",
			"marker",
			"points",
			"polygons",
			"geopoints",
			"geopolygons",
			"polylines",
			"shapes",
			"overlay",
			"control",
			"infowindow"
		];

	}]);