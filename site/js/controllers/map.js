angular.module('App')
	.controller('map', ['$scope', function($scope){

		$scope.map = {
      center: [39, -121],
      options: function() {
          return {
            streetViewControl: false,
            scrollwheel: false
          }
      },
      events: {
        click: function(e, map) {
          alert(e.latLng.lat() + " " + e.latLng.lng());
        }
      }
    };

	}]);