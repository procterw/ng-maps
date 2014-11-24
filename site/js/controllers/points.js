angular.module('App')
	.controller('points', ['$scope', function($scope){

		$scope.map = {
      center: [47.5, -122.5],
      options: function() {
          return {
          	streetViewControl: false,
          	scrollwheel: false
          }
      }
    };

		$scope.points = {
			coords: [
				[47,-122],
				[48,-123],
				[47,-123],
				[48,-122]
			],
			options: function(c, p, i, map) {
				return {
					draggable: true
				}
			},
			events: {
				click: function(e, point, map, points) {
					alert(point)
				}
			},
			decimals: 3
		};

	}]);