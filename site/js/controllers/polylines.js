angular.module('App')
	.controller('polylines', ['$scope', function($scope){

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

		$scope.polylines = {
			coords: [
			  [
				[25.774252, -80.190262],
			    [18.466465, -66.118292],
			    [32.321384, -64.75737],
			    [25.774252, -80.190262]
			  ],
			  [
			  	[26.774252, -79.190262],
			    [19.466465, -65.118292],
			    [33.321384, -64.75737],
			    [26.774252, -79.190262]
			  ],
			],
			options: function(l, map) {
				return {
					strokeColor: "#d35400"
				};
			}
		}
		  

	}]);