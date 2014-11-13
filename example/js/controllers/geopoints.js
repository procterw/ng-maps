angular.module('App')
	.controller('geopoints', ['$scope', function($scope){

	$scope.map = {
      center: [39, -121],
      options: {
      	zoom: 6,
      	streetViewControl: false,
      	scrollwheel: false
      }
    };

	$scope.stations = {
		url: "data/AirNow_Sites_PM2.5.geojson",
		events: {
			click: function(e, m) {
				var lat = e.latLng.lat();
				var lng = e.latLng.lng();
				var name = m.getProperty("siteName");
				alert(lat + " " + lng + " " + name);
			}
		}
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