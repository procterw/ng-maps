angular.module('App')
	.controller('geopolygons', ['$scope', function($scope){

	$scope.map = {
      center: [39, -121],
      options: {
      	zoom: 6,
      	streetViewControl: false,
      	scrollwheel: false
      }
    };

	$scope.states = {
		url: "data/states.geojson"
	}

		$scope.parameters = [

    	{
    		name: "url",
    		type: "string",
    		details: "A path to a .geojson file"
    	},
    	{
    		name: "visible",
    		type: "boolean",
    		details: "Is this layer visible?"
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