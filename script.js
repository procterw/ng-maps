angular.module('MapTest', ['ng-data-map'])

	.controller('mainctrl', ['$scope', 'Utils', function($scope, Utils) {

		var getStationID = function(e) {
			console.log(e.feature.getProperty('AQSID'))
		}

		$scope.mapOptions = {
			center: [47.5, -122],
			events: {
				click: function(e, Map) {
					$scope.$apply($scope.coords = [e.latLng.lat(), e.latLng.lng()])
					
				}
			}
		}

		$scope.stations = {
			url: "AirNowSites_PM2.5.geojson",
			events: {
				click: getStationID
			},
			style: function(e, Map) {
				var icon = "icons/" + Utils.colorAQI(e.getProperty("mean24"));
				return {
					visible: true,
					icon: icon
				}
			}
	
		};

		$scope.marker = {
			options: {
				draggable: true
			},
			events: {
				drag: function(e, Map) {
					var closest = Map.closest(e.latLng, Map.map.data)
					console.log(closest)
				},
				click: function(e, Map) {
					
				}
			},
			clickToMove: true,
			position: [47.5, -122]
		}

		$scope.overlay1 = {
			bounds: new google.maps.LatLngBounds(
		      new google.maps.LatLng(23.02083, -124.9792),
		      new google.maps.LatLng(50.97917, -65.02084)),
			url: "overlays/Apr_12Z_H.png",
			opacity: 0.8,
			visible: false
		}

		$scope.overlay2 = {
			bounds: new google.maps.LatLngBounds(
		      new google.maps.LatLng(23.02083, -124.9792),
		      new google.maps.LatLng(50.97917, -65.02084)),
			url: "overlays/Apr_12Z_H.png",
			opacity: 0.8,
			visible: false
		}



	}])


	 .factory('Utils', function () {

	        var API = {};

	        API.colorAQI = function(val) {
		      if (val < 12) {
		        return "iconGreen.svg"; // Good
		      } else if (val < 35.5) { 
		        return "iconYellow.svg"; // Moderate 
		      } else if (val < 55.5) { 
		        return "iconOrange.svg"; // Unhealthy for sensitive groups
		      } else if (val < 150.5) { 
		        return "iconRed.svg"; // Unhealthy
		      } else if (val < 250.5) { 
		        return "iconPurple.svg"; // Very unhealthy
		      } else if (val < 500.5) { 
		        return "iconPurple.svg"; // Hazardous
		      } else { 
		        return "iconGrey.svg"; // No data
		      };
		    }

	        return API;

	    })