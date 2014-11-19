angular.module('App')
	.controller('control', ['$scope', function($scope){

		$scope.map = {
      center: [47.5, -122.5],
      options: {
      	zoom: 6,
      	streetViewControl: false,
      	scrollwheel: false
      }
    };

	  $scope.marker = {
			position: [47.5, -122.5],
      decimals: 4,
			options: {
				draggable: true
			}
		}

	}]);