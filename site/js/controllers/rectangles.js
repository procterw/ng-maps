angular.module('App')
	.controller('rectangles', ['$scope', function($scope){

		$scope.map = {
	      center: [39, -121],
	      options: {
	      	streetViewControl: false,
	      	scrollwheel: false
	      }
	    };

	    $scope.rect = {
	    	bounds: [
	    		{
	    			SW: [38,-122],
	    			NE: [39,-121]
	    		},
	    		{
	    			SW: [38.5,-121.5], 
	    			NE: [39.5,-120.5]
	    		}
	    	],
	    	options: function(c, map, i) {
	    		var edit = i === 0;
	    		return {
	    			editable: edit,
	    			fillColor: "#e67e22",
					strokeColor: "#d35400"
	    		}
	    	}
	    }

	}]);