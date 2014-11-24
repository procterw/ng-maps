angular.module('App')
	.controller('Main', ['$scope', '$location', function($scope, $location){

		$scope.template = function() {
			return "templates/" + $scope.selected + ".html"
		}

		$scope.selected = "map"

		$scope.click = function(item) {
			$scope.selected = item;
		}

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