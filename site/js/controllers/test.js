angular.module('App')
	.controller('Test', ['$scope', function($scope){

		$scope.map = {
	    center: [25, -70],
      options: function() {
          return {
          	zoom: 5,
          	streetViewControl: false,
          	scrollwheel: false
          }
      }
    };

    $scope.geojson1 = {
    	url: 'data/states.geojson',
    	options: function(d) {
    		return {strokeColor: "blue"};
    	}
    };

    $scope.geojson2 = {
    	url: 'data/AirNow_Sites_PM2.5.geojson',
    	options: function(d) {
    		return {fillColor: "red"};
    	}
    };
		  

	}]);