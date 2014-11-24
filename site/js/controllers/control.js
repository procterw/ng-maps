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

    $scope.test = function() {
    	console.log("WOW")
    }

	  $scope.marker = {
			position: [47.5, -122.5],
      decimals: 4,
			options: function() {
				return { draggable: true };
			}
		}

	}]);