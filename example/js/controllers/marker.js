angular.module('App')
	.controller('marker', ['$scope', function($scope){

    	$scope.map = {
          center: [39, -121],
          options: {
          	zoom: 6,
          	streetViewControl: false,
          	scrollwheel: false
          }
        };

		$scope.marker = {
			position: [39, -121],
            decimals: 4,
			options: {
				draggable: true
			}
		}

		$scope.parameters = [

    	{
    		name: "position",
    		type: "array",
    		details: "An array of two numbers."
    	},
    	{
    		name: "lat",
    		type: "float",
    		details: "A numeric latitude value."
    	},
    	{
    		name: "lng",
    		type: "float",
    		details: "A numeric longitude value."
    	},
    	{
    		name: "decimals",
    		type: "int",
    		details: "Number of decimal places to round to when dragging"
    	},
    	{
    		name: "options",
    		type: "object",
    		details: "Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions'>MarkerOptions object specification</a>"
    	},
    	{
    		name: "events",
    		type: "object",
    		details: "Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#Marker'>Marker events specification</a>"
    	}

    ]

	}]);