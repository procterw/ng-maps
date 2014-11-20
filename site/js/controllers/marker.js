angular.module('App')
	.controller('marker', ['$scope', function($scope){

    	$scope.map = {
          center: [39, -121],
          options: {
          	zoom: 6,
          	streetViewControl: false,
          	scrollwheel: false
          }
        };

		$scope.marker = {
			position: [39, -121],
            decimals: 4,
			options: {
				draggable: true
			}
		}

	}]);