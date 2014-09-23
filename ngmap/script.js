angular.module('MapTest', ['ng-data-map'])

	.controller('mainctrl', ['$scope', 'Utils', function($scope, Utils) {

		var getStationID = function(e) {
			console.log(e.feature.getProperty('AQSID'))
		}

		$scope.coords = [47.5, -122]

		$scope.mapOptions = {
			center: $scope.coords,
			events: {
				click: function(e, map, scope) {
					scope.activeMarker.setPosition(e.latLng)
					console.log(scope)
					var closest = scope.closest(e.latLng, map.data)
					console.log(closest)
				}
			}
		}

		$scope.stations = {
			url: "AirNowSites_PM2.5.geojson",
			events: {
				click: getStationID
			},
			style: function(e) {
				var icon = "icons/" + Utils.colorAQI(e.getProperty("mean24"));
				return {
					visible: true,
					icon: icon
				}
			}
	
		};

		$scope.marker = {
			options: {
				position: $scope.coords,
				draggable: true
			},
			events: {
				drag: function(e, map, scope) {
					var closest = scope.closest(e.latLng, map.data)
					console.log(closest)
				}
			},
			clickToMove: true
		}

		$scope.marker2 = {
			options: {
				position: [47, -121]
			},
			events: {
			},
			clickToMove: true
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