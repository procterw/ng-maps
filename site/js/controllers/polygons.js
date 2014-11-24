angular.module('App')
	.controller('polygons', ['$scope', function($scope){

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

		$scope.polygons = {
			coords: [
				[[
					[25.774252, -80.190262],
			    [18.466465, -66.118292],
			    [32.321384, -64.75737],
			    [25.774252, -80.190262],
			  ]],
			  [[
			  	[26.774252, -79.190262],
			    [19.466465, -65.118292],
			    [33.321384, -64.75737],
			    [26.774252, -79.190262],
			  ]],
			],
			options: function(geometry, properties, map, i) {
				return {
					fillColor: "#e67e22",
					strokeColor: "#d35400"
				}
			},
			opacity: 50
		}
		  

	}]);