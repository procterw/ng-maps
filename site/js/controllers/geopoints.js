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

	}]);