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
	    		[
	    			[38,-122], [39,-121]
	    		],
	    		[
	    			[38.5,-121.5], [39.5,-120.5]
	    		]
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