angular.module('App')
	.controller('infowindow', ['$scope', function($scope){

		$scope.map = {
      center: [47.5, -122.5],
      options: function() {
        return {
        	streetViewControl: false,
        	scrollwheel: false
        }
      }, 
      events: {
      	click: function(e) {
      		$scope.infowindow.position = e.latLng;
      		$scope.$apply()
      	}
      }
    };

		$scope.infowindow = {
			position: [47.6, -122.5]
		}

	}]);