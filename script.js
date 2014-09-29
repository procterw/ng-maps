angular.module('MapTest', ['ng-data-map'])


	.controller('mainctrl', ['$scope', 'Utils', function($scope, Utils) {

		$scope.selectedStation = 530330017;

		$scope.toggleAirNow = function() {
			$scope.airnow.visible = !$scope.airnow.visible;
		}

		$scope.toggleEBAM = function() {
			$scope.ebam.visible = !$scope.ebam.visible;
		}

		$scope.mapOptions = {
			center: [47.5, -122],
			zoom: 6,
			events: {
				click: function(e, Map) {
					$scope.$apply($scope.coords = [e.latLng.lat(), e.latLng.lng()])
					
				}
			}
		}

		$scope.airnow = {
			url: "AirNow_Sites_PM2.5.geojson",
			events: {
				click: function(e, marker, Map){
					$scope.$apply(
						$scope.selectedStation = marker.getProperty("monitorID"),
						$scope.infowindow.title = "AirNow",
						$scope.infowindow.position = e.latLng,
						$scope.infowindow.variables = ["ID", "Mean 08", "Mean 24"],
						$scope.infowindow.values = [marker.getProperty("monitorID"), marker.getProperty("mean08"), marker.getProperty("mean24")]
					);
				}
			},
			style: function(e, Map) {
				var icon = "icons/airnow/" + Utils.colorAQI(e.getProperty("mean24")) + "-01.svg"
				return {
					visible: true,
					icon: icon
				}
			},
			visible: true
		};

		$scope.ebam = {
			url: "EBAM_Sites_PM2.5.geojson",
			events: {
				click: function(e, marker, Map){
					$scope.selectedStation = marker.getProperty("monitorID"),
					$scope.infowindow.title = "EBAM",
					$scope.infowindow.position = e.latLng,
					$scope.infowindow.variables = ["ID", "Mean 08", "Mean 24"],
					$scope.infowindow.variables = ["ID", "Mean 08", "Mean 24"],
					$scope.infowindow.values = [marker.getProperty("monitorID"), marker.getProperty("mean08"), marker.getProperty("mean24")]
					// $scope.$apply(
						
						
						
						
					// );
				}
			},
			style: function(e, Map) {
				var icon = "icons/ebam/" + Utils.colorAQI(e.getProperty("mean24")) + "-01.svg"
				return {
					visible: true,
					icon: icon
				}
			},
			visible: true
		};

		$scope.marker = {
			options: {
				draggable: true
			},
			events: {
				drag: function(e, Map) {
					// var closest = Map.closest(e.latLng, Map.map.data)
					// console.log(closest)
				},
				click: function(e, Map) {
					
				}
			},
			clickToMove: true,
			position: [47.5, -122]
		}

		$scope.infowindow = {
		}

		$scope.hucs = {
			url: "polygons.geojson",
			options: {
				fillColor: "red",
				fillOpacity: 1
			},
			events: {
				mouseout: function(e, polygon) {
					polygon.setOptions({fillColor: "red"})
				},
				mouseover: function(e, polygon) {
					polygon.setOptions({fillColor: "blue"})
				}
			}
		}


	}])


	 .factory('Utils', function () {

	        var API = {};

	        API.colorAQI = function(val) {
		      if (val < 12) {
		        return "green"; // Good
		      } else if (val < 35.5) { 
		        return "yellow"; // Moderate 
		      } else if (val < 55.5) { 
		        return "orange"; // Unhealthy for sensitive groups
		      } else if (val < 150.5) { 
		        return "red"; // Unhealthy
		      } else if (val < 250.5) { 
		        return "purple"; // Very unhealthy
		      } else if (val < 500.5) { 
		        return "purple"; // Hazardous
		      } else { 
		        return "grey"; // No data
		      };
		    }

	        return API;

	    })