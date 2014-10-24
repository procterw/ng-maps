angular.module('App')
	.controller('Main', ['$scope', function($scope){

		$scope.options = [
			{opt: "map", selected: true},
			{opt: "marker", selected: false},
			{opt: "points", selected: false},
			{opt: "polygons", selected: false},
			{opt: "geopoints", selected: false},
			{opt: "geopolygons", selected: false},
			{opt: "polylines", selected: false},
			{opt: "shapes", selected: false},
			{opt: "overlay", selected: false},
			{opt: "control", selected: false},
			{opt: "infowindow", selected: false}
		]

		$scope.clearOptions = function(opt) {
			var index = $scope.options.indexOf(opt);
			for (var i=0;i<$scope.options.length;i++) {
				$scope.options[i].selected = false;
			}
			$scope.options[index].selected = true;
		}
		

	}]);