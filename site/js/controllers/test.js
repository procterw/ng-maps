angular.module('App')
	.controller('Test', ['$scope', function($scope){

		$scope.map = {
	    center: [0, 102],
      options: function() {
          return {
          	zoom: 6,
          	streetViewControl: false,
          	scrollwheel: false
          };
      }
    };


    setTimeout(function() {
      $scope.P1.geojson.geometry.coordinates = [102,2];
      $scope.P1.geojson.properties.prop0 = "foo123";
      $scope.P2.lon = 104;
      $scope.P2.properties = {a:2, b:7};
      $scope.$apply();
    }, 3000);

    $scope.P1={
    	geojson: { "type": "Feature",
					        "geometry": {"type": "Point", "coordinates": [101, 1]},
					        "properties": {"prop0": "value0"}
			},
			options: function() {
				return {
					draggable: true
				};
			},
			events: {
				click: function(e, feature, map) {
          console.log(feature);
				}
			},
			onInit: function(feature, dataset) {

			},
			visible: true
    };

    $scope.P2={
			lon: 103,
			lat: 0,
			properties: {a:1, b:2},
			visible: true
    };

    $scope.Poly = {
			geojson: { "type": "Feature",
			         "geometry": {
			           "type": "Polygon",
			           "coordinates": [
			             [ [101.0, 3.0], [102.0, 3.0], [102.0, 4.0],
			               [101.0, 4.0], [101.0, 3.0] ]
			             ]
			         },
			         "properties": {
			           "foo": [1,2,3,4,5],
			           "bar": {"name": "Frank"}
			          }
			        },
			options: function(coords, properties, map, i) {
				return {

				};
			},
			events: {
				click: function(e, feature, map) {

				}
			},
			opacity: 0.2,
			onInit: function(feature, dataset) {

			}
    };

    $scope.FC={
    	options: {
    		Point: function(coordinates, properties, map, i) {
    			return {
    				draggable: true
    			};
    		}
    	},
    	events: {
    		Point: {
    			click: function(e, feature, map) {

    			}
    		},
    		Polygon: {
    			click: function(e, feature, map) {

    			}
    		}
    	},
    	opacity: 0.2,
    	visible: true,
    	url: "data/collection.geojson",
    	onInit: function(features, dataset) {

    	},
    	geojson: {"type": "FeatureCollection",
						    "features": [
						      { "type": "Feature",
						        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
						        "properties": {"prop0": "value0"}
						        },
						      { "type": "Feature",
						        "geometry": {
						          "type": "LineString",
						          "coordinates": [
						            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
						            ]
						          },
						        "properties": {
						          "prop0": "value0",
						          "prop1": 0.0
						          }
						        },
						      { "type": "Feature",
						         "geometry": {
						           "type": "Polygon",
						           "coordinates": [
						             [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
						               [100.0, 1.0], [100.0, 0.0] ]
						             ]
						         },
						         "properties": {
						           "prop0": "value0",
						           "prop1": {"this": "that"}
						           }
						         }
						      ]
						    }

    };

	}]);