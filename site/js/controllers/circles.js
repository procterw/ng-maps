angular.module('App')
	.controller('circles', ['$scope', function($scope){

		$scope.map = {
	      center: [39, -121],
	      options: {
	      	zoom: 6,
	      	streetViewControl: false,
	      	scrollwheel: false
	      }
	    };

	    $scope.circles = {
	    	geometries: [
	    		{
		    		center: [39, -121],
		    		radius: 10000
		    	},
		    	{
		    		center: [39, -121],
		    		radius: 50000
		    	},
		    	{
		    		center: [39, -121],
		    		radius: 100000
		    	}
	    	],
	    	options: function(c, map, i) {
	    		var opacity = 1/(i+1)
	    		return {
	    			fillOpacity: opacity,
	    			fillColor: "#e67e22",
					strokeColor: "#d35400"
	    		}
	    	}
	    }

	}]);