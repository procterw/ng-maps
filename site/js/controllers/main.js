angular.module('App')
	.controller('Main', ['$scope', '$location', function($scope, $location){

		$scope.template = function() {
			return "templates/" + $scope.selected + ".html"
		};

		$scope.selected = "map";

		$scope.click = function(item) {
			$scope.selected = item;
		};

		$scope.titleMap = {
			center: [50, 10],
			options: function(){
				return {
					zoom: 5,
					streetViewControl: false,
          scrollwheel: false
				}
			}
		};

		var lng = 10;
		setInterval(function() {
			lng = lng + 40;
			if (lng > 180) lng = lng - 360;
			$scope.titleMap.center = [50,lng];
			$scope.$apply();
		}, 1500);

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
			"infowindow",
			"textLabels"
		];

	}]);