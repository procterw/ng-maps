angular.module('App')
	.controller('map', ['$scope', function($scope){

		$scope.map = {
      center: [39, -121],
      options: {
      	zoom: 4,
      	streetViewControl: false,
      	scrollwheel: false
      }
    };

	}]);