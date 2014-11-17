angular.module('App')
	.controller('geopolygons', ['$scope', function($scope){

	$scope.map = {
      center: [40, -100],
      options: {
      	streetViewControl: false,
      	scrollwheel: false
      },
      zoom: 4
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