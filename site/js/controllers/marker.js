angular.module('App')
	.controller('marker', ['$scope', function($scope){

  	$scope.map = {
      center: [39, -121],
      options: function() {
          return {
            streetViewControl: false,
            scrollwheel: false
          }
      }
    };

		$scope.marker = {
			position: [39, -121],
      decimals: 4,
			options: function() {
        return { draggable: true };
			}
		}

	}]);