angular.module('App')
	.controller('control', ['$scope', function($scope){

		$scope.map = {
      center: [47.5, -122.5],
      options: function() {
        return {
        	streetViewControl: false,
        	scrollwheel: false
        }
      }
    };

    $scope.click = function() {
    	alert($scope.marker.position);
    }

	  $scope.marker = {
			position: [47.5, -122.5],
      decimals: 4,
			options: function() {
				return { draggable: true };
			}
		}

	}]);