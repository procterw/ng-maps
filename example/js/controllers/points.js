angular.module('App')
	.controller('points', ['$scope', function($scope){

		$scope.map = {
      center: [47.5, -122.5],
      options: {
      	zoom: 6,
      	streetViewControl: false,
      	scrollwheel: false
      }
    };

		$scope.points = {
			coords: [
				[47,-122],
				[48,-123],
				[47,-123],
				[48,-122]
			],
			options: {
				draggable: true
			},
			events: {
				click: function(e, m) {
					alert(e, m);
				}
			},
			decimals: 3
		};

	}]);