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

    ////////////////////
    ////////////////////
    ////////////////////
    // POINT TESTS
    ////////////////////
    ////////////////////
    ////////////////////

    $scope.point={
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
          console.log("properties: ", feature.properties);
				}
			},
			onInit: function(feature, dataset) {

			},
			visible: true,
			lon: 103,
			lat: 0,
			properties: {a:1, b:2}
    };

    setTimeout(function() {
    	console.log("++++++++++++++");
    	console.log("POINT TEST");
    	console.log("++++++++++++++");
    }, 0);

    // test by clicking
    setTimeout(function() {
    	console.log("coords should move for both point")
    	console.log("new point1 properties: {prop0:'foo123'}");
    	console.log("new point2 properties: {a:2, b:7}");
      $scope.point.geojson.geometry.coordinates = [102,2];
      $scope.point.geojson.properties.prop0 = "foo123";
      $scope.point.lon = 104;
      $scope.point.properties = {a:2, b:7};
      $scope.$apply();
    }, 1000);

    setTimeout(function() {
    	console.log("toggling visibility");
    	$scope.point.visible = false;
    	$scope.$apply();
    }, 2000);

    setTimeout(function() {
    	$scope.point.visible = true;
    	$scope.$apply();
    }, 3000);


    ////////////////////
    ////////////////////
    ////////////////////
    // POLYGON TESTS
    ////////////////////
    ////////////////////
    ////////////////////

    $scope.polygon = {
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
			coordinates: [[ [102.0, 3.0], [103.0, 3.0], [103.0, 4.0],
			               [102.0, 4.0], [102.0, 3.0] ]],
			options: function(coords, properties, map, i) {
				return {
					fillColor: "blue"
				};
			},
			events: {
				click: function(e, feature, map) {
					console.log(feature.properties);
				}
			},
			opacity: 0.2,
			onInit: function(feature, dataset) {

			}
    };

    setTimeout(function() {
    	console.log("++++++++++++++");
    	console.log("POLYGON TEST");
    	console.log("++++++++++++++");
    }, 4000);

    setTimeout(function() {
    	console.log("polygons should change opacity");
    	$scope.polygon.opacity = 1;
    	$scope.$apply()
    }, 4000);

    setTimeout(function() {
    	console.log("polygons should turn red");
    	$scope.polygon.options = function(coords, properties, map, i) {
    		return { fillColor: "red"};
    	}
    	$scope.$apply()
    }, 5000);

    setTimeout(function() {
    	console.log("polygons should move");
    	$scope.polygon.coordinates = [[ [100.0, 1.0], [100.0, 1.0], [100.0, 2.0],
			               [99.0, 2.0], [99.0, 1.0] ]];
			$scope.polygon.geojson.geometry.coordinates = [[ [99.0, 1.0], [99.0, 1.0], [99.0, 2.0],
			               [98.0, 2.0], [98.0, 1.0] ]];
    	$scope.$apply()
    }, 6000);


    ////////////////////
    ////////////////////
    ////////////////////
    // POLYLINE TESTS
    ////////////////////
    ////////////////////
    ////////////////////

    $scope.linestring = {
    	coordinates: [[101.0, 0.0], [102.0, 1.0], [103.0, 0.0], [104.0, 1.0]],
    	properties: {foo: 5, bar: 10},
    	options: function() {
    		return {}
    	},
    	events: {
    		click: function(e, feature, map) {
    			console.log(feature);
    		}
    	},
    	opacity: 0.5,
    	visible: true,
    	onInit: function(features, dataset) {

    	},
    	geojson: { "type": "Feature",
					        "geometry": {
					          "type": "LineString",
					          "coordinates": [[103.0, 0.0], [104.0, 1.0], [105.0, 0.0], [106.0, 1.0]]
					        },
					        "properties": {
					          "prop0": "value0",
					          "prop1": 0.0
					          }
					        }
    }

    setTimeout(function() {
    	console.log("polylines should move");
    	$scope.linestring.coordinates = [[104.0, 0.0], [105.0, 1.0], [106.0, 0.0], [107.0, 1.0]]
			$scope.linestring.geojson.geometry.coordinates = [[100.0, 0.0], [101.0, 1.0], [102.0, 0.0], [103.0, 1.0]]
    	$scope.$apply()
    }, 7000);

    setTimeout(function() {
    	console.log("polylines should change opacity");
    	$scope.linestring.opacity = 1;
    	$scope.$apply();
    }, 8000);

    setTimeout(function() {
    	console.log("polylines should toggle visibility");
    	$scope.linestring.visible = false;
    	$scope.$apply();
    }, 9000);

    setTimeout(function() {
    	console.log("polylines should turn green and thick");
    	$scope.linestring.visible = true;
    	$scope.linestring.options = function() {
    		return {
    			strokeColor: "green",
    			strokeWeight: 5
    		}
    	}
    	$scope.$apply()
    }, 10000);

    ////////////////////
    ////////////////////
    ////////////////////
    // FEATURE COLLECTION TESTS
    ////////////////////
    ////////////////////
    ////////////////////

    $scope.FC = {
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

    // setTimeout(function() {
    // 	console.log("features should turn different colors");
    // 	$scope.linestring.visible = true;
    // 	$scope.linestring.options = function() {
    // 		return {
    // 			strokeColor: "green",
    // 			strokeWeight: 5
    // 		}
    // 	}
    // 	$scope.$apply()
    // }, 10000);


	}]);