angular.module('App')
	.controller('overlay', ['$scope', function($scope){

		$scope.map = {
      center: [39, -100],
      options: function() {
          return {
          	zoom: 4,
          	streetViewControl: false,
          	scrollwheel: false
          }
      }
    };

	   $scope.overlay = {
	  	url: "data/overlays/Apr_00Z_H.png",
	  	bounds: {
	  		SW: [23.02083, -124.9792],
	  		NE: [50.97917, -65.02084]
	  	}
	   }

	}]);