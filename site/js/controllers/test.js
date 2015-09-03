angular.module('App')
	.controller('Test', ['$scope', function($scope){

		$scope.map = {
	    center: [0, 102],
      options: function() {
          return {
          	zoom: 5,
          	streetViewControl: false,
          	scrollwheel: false
          }
      }
    };

    $scope.FC={
    	options: {
    		Point: function(coordinates, properties, map, i) {
    			return {
    				draggable: true
    			}
    		}
    	},
    	events: {
    		Point: {
    			click: function(a,b,c) {
    				console.log(a,b,c);
    			}
    		}
    	},
    	opacity: 0.2,
    	visible: true,
    	url: "data/collection.geojson",
    	geojson: { "type": "FeatureCollection",
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

    }

	}]);