angular.module('App')
	.controller('map', ['$scope', function($scope){

		$scope.map = {
      center: [39, -121],
      options: {
      	zoom: 4,
      	streetViewControl: false,
      	scrollwheel: false
      }
    };

    $scope.parameters = [

    	{
    		name: "center",
    		type: "array",
    		details: "An array of two numbers."
    	},
    	{
    		name: "options",
    		type: "object",
    		details: "Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#MapOptions'>MapOptions object specification</a>"
    	},
    	{
    		name: "events",
    		type: "object",
    		details: "Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#Map'>Map events specification</a>"
    	}

    ]

	}]);