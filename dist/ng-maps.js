angular.module('ngMaps', []);;
angular.module("ngMaps")
	.factory("GeoJSONService", function() {

	  return {
	    Point: Point,
	    LineString: LineString,
	    Polygon: Polygon
	  };

	  // Passes coords to google maps in reverse order
	  // Remember GeoJSON is Lon Lat instead of Lat Lon
	  function toLatLng(c) {
	    return new google.maps.LatLng(c[1], c[0]);
	  }

	  // Shared event setter
	  function setEvents(events, feature, map) {
			for (var eventType in events) {
	      google.maps.event.addListener(feature, eventType, function(e) {
	        events[eventType](e, feature, map);
	      });
	    }
	    return feature;
	  }

	  //-----------------------------------------//
	  //  ___  ___ ___ _  _ _____ 
	  // | _ \/ _ \_ _| \| |_   _|
	  // |  _/ (_) | || .` | | |  
	  // |_|  \___/___|_|\_| |_|  
	  //
	  //-----------------------------------------//
	                            

	  function Point(geometry, properties, options, events, map) {

	  	var _coords = geometry.coordinates;
      var _properties = properties;
	    var _options = options(_coords, properties, map, 0);

	    _options.position = toLatLng(_coords);
	    _options.map = map;

	    var _feature = new google.maps.Marker(_options);

	    _feature = setEvents(events, _feature, map);

	    function setOptions(options) {
	    	_options = options(_coords, properties, map, 0);
        _options.properties = properties;
	      _feature.setOptions(_options);
	    }

	    function setPosition(coords) {
	    	_coords = coords;
	    	_feature.setPosition(toLatLng(coords))
	    }

      function setProperties(properties) {
        _properties = properties;
        setOptions(options);
      }

	    function setVisible(visible) {
	    	_feature.setVisible(visible);
	    }

	    function getMapFeature() { 
	    	return _feature;
	    }

	    return {
	      setOptions: setOptions,
	      setEvents: setEvents,
	      setPosition: setPosition,
        setProperties: setProperties,
	      setVisible: setVisible,
	      getMapFeature: getMapFeature
	    };

	  }

	  //-----------------------------------------//
	  //  _    ___ _  _ ___ ___ _____ ___ ___ _  _  ___ 
	  // | |  |_ _| \| | __/ __|_   _| _ \_ _| \| |/ __|
	  // | |__ | || .` | _|\__ \ | | |   /| || .` | (_ |
	  // |____|___|_|\_|___|___/ |_| |_|_\___|_|\_|\___|
	  //                                              
	  //-----------------------------------------//


	  function LineString(geometry, properties, options, events, map) {

	  	var _coords = geometry.coordinates;
	  	var _properties = properties;
	    var _options = options(_coords, properties, map, 0);

	    _options.path = _coords.map(toLatLng);
	    _options.map = map;

	    var _feature = new google.maps.Polyline(_options);

	    var _opacity;

	    _feature = setEvents(events, _feature, map);

	    function setOptions(options) {
	    	_options = options(_coords, properties, map, 0);
	      _feature.setOptions(_options);
	    }

	    function setProperties(properties) {
        _properties = properties;
        setOptions(options);
      }

      function setPath(coords) {
      	_coords = coords;
	    	_feature.setPath(coords.map(toLatLng))
	    }

	    function setVisible(visible) {
	    	_feature.setVisible(visible);
	    }

	    function setOpacity(opacity) {
	    	if (opacity > 1) opacity = opacity/100;
	    	_opacity = opacity;
	    	_options.strokeOpacity = _opacity;
	    	_feature.setOptions(_options);
	    }

	    function getMapFeature() { 
	    	return _feature;
	    }

	    return {
	      setOptions: setOptions,
	      setEvents: setEvents,
	      setProperties: setProperties,
	      setPath: setPath,
	      setVisible: setVisible,
	      setOpacity: setOpacity,
	      getMapFeature: getMapFeature
	    };

	  }

	  //-----------------------------------------//
	  //  ___  ___  _ __   _____  ___  _  _ 
	  // | _ \/ _ \| |\ \ / / __|/ _ \| \| |
	  // |  _/ (_) | |_\ V / (_ | (_) | .` |
	  // |_|  \___/|____|_| \___|\___/|_|\_|
	  //
	  //-----------------------------------------//


	  function Polygon(geometry, properties, options, events, map) {

	    // Create options
	    var _coords = geometry.coordinates;
	    var _properties = properties;
	    var _options = options(_coords, properties, map, 0);

	    // Format points in google maps LatLng class
	    _options.paths = _coords.map(function(c) {
	      return c.map(toLatLng);
	    });
	    _options.map = map;

	    // Map feature
	    var _feature = new google.maps.Polygon(_options);

	    var _opacity;

	    _feature = setEvents(events, _feature, map);

	    function setOptions(options) {
	    	_options = options(_coords, properties, map, 0);
	      _feature.setOptions(_options);
	    }

	    function setVisible(visible) {
	    	_feature.setVisible(visible);
	    }

	    function setProperties(properties) {
        _properties = properties;
        setOptions(options);
      }

      function setPath(coords) {
      	_coords = coords;
      	_feature.setPaths(coords.map(function(c) {
		      return c.map(toLatLng);
		    }));
      }

	    function setOpacity(opacity) {
	    	if (opacity > 1) opacity = opacity/100;
	    	_opacity = opacity;
	    	_options.strokeOpacity = _opacity;
	    	_options.fillOpacity = _opacity;
	    	_feature.setOptions(_options);
	    }

	    function getMapFeature() { 
	    	return _feature;
	    }

	    return {
	      setOptions: setOptions,
	      setEvents: setEvents,
	      setVisible: setVisible,
	      setPath: setPath,
	      setProperties: setProperties,
	      setOpacity: setOpacity,
	      getMapFeature: getMapFeature
	    };

	  }
  
	});;angular.module("ngMaps")
	.factory("MultiPolygonService", function() {

		// Takes a polygon or multipolygon and adds additional funtionality
    return function(p, i, map, options, opacity) {

      this.type = p.geometry.type;
      this.properties = p.properties;

      this.setOptions = function(o) {
        angular.forEach(polygons, function(p) {
          p.setOptions(o);
        });
      };

      this.setVisible = function(o) {
        angular.forEach(polygons, function(p) {
          p.setVisible(o);
        });
      };

      this.getMap = function(o) {
        angular.forEach(polygons, function(p) {
          p.getMap(o);
        });
      };

      // All of the polygon objects in this collection
      var polygons = [];

      var opts = options ? options(p.geometry, p.properties, i, map) : {};
      opts.fillOpacity = opacity ? opacity/100 : 1;

      if (this.type === "MultiPolygon") {

        angular.forEach(p.geometry.coordinates, function(c) {
          angular.forEach(c, function(c2) {
            // Each c2 is a single polygon
            var coords = [];
            // Create google map latlngs
            angular.forEach(c2, function(c3) {
              coords.push(new google.maps.LatLng(c3[1], c3[0]))
            });
            // New polygon
            var polygon = new google.maps.Polygon({
              paths: coords
            });
            // Set options and map
            polygon.setOptions(opts);
            polygon.setMap(map);
            // Add to polygon array
            polygons.push(polygon);
          });
        });

      } else { // Normal polygon

        var coords = [];
        angular.forEach(p.geometry.coordinates, function(c) {
          // Create google map latlngs
          angular.forEach(c, function(c2) {
            coords.push(new google.maps.LatLng(c2[1], c2[0]))
          });
        });
        // New polygon
        var polygon = new google.maps.Polygon({
          paths: coords
        });
        // Set options and map
        polygon.setOptions(opts);
        polygon.setMap(map);
        // Add to polygon array
        polygons.push(polygon);

      }

      this.polygons = polygons;

    };

	});;angular.module('ngMaps')
  .directive('circles', [function() {
  return {
      restrict: 'E',
      scope: {
        geometries: '=',  // array [{}, {}]
        events: '=',      // object {event:function(), event:function()}
        visible: '=',     // boolean
        options: '=',     // function() { return {} }
        opacity: '=',      // int <= 100
        properties: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Set map
          var map = parent.getMap();

          // List of circles
          var circles = [];

          var properties = $scope.properties ? $scope.properties : [];

          // Watch for changes in visibility
          $scope.$watch('visible', function() {
            angular.forEach(circles, function(c) {
              c.setVisible($scope.visible)
            })
          })

          // Watch for changes in options
          $scope.$watch('options', function() {
            angular.forEach(circles, function(c, i) {
              c.setOptions($scope.options(c, properties, map, i));
            })
          })

          // Watch for changes in data
          $scope.$watch('geometries', function() {
            newData();
          })

          // Watch for changes in opacity
          $scope.$watch('opacity', function() {
            if ($scope.opacity) {
              angular.forEach(circles, function(c) {
                c.setOptions({fillOpacity: $scope.opacity / 100});
              });
            }
          });

          // Make a new collection of circles
          function newData() {

            // Remove each object from map
            angular.forEach(circles, function(c){
              c.setMap(null);
            })

            // Delete objects
            circles = [];

            // Create new objects
            angular.forEach($scope.geometries, function(c, i) {

              var opts = $scope.options ? $scope.options(c, properties, map, i) : {};
              opts.center = new google.maps.LatLng(c.center[0], c.center[1]);
              opts.radius = c.radius;
              opts.map = map;

              var circle = new google.maps.Circle(opts);
              circles.push(circle)

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(circle, key, function(e) {
                  val(e, this, circles, i);
                });
              });

            })
          }

          

          

        });

      }
    };
}]);// TODO
// add a watch on visible
// figure out how to evaluate angular in the innerHTML

// http://stackoverflow.com/questions/18776818/angularjs-ng-click-inside-of-google-maps-infowindow

angular.module('ngMaps')
  .directive('control', ['$compile', function($compile) {
    return {
      restrict: 'E',
      scope: {
        position: '@',  // string, camelcase i.e. topLeft, rightBottom
        visible: '='    // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          // parse position attribute i.e. "topRight" to "TOP_RIGHT"
          var position = $scope.position.split(/(?=[A-Z])/).join("_").toUpperCase();

          $scope.$watch(function() {
            $element[0].style.display = "none"; // important: without this the HTML content won't display
            return $element[0].innerHTML;
          }, function() {

            var content = $element.html();
            var compiled = $compile($element.html())($scope.$parent.$parent);

            var controlDiv = document.createElement('div');

            var controlList = map.controls[google.maps.ControlPosition[position]];

            if (controlList.length > 0) map.controls[google.maps.ControlPosition[position]].pop();
            if ($scope.visible !== false) { controlDiv.innerHTML = content }
            map.controls[google.maps.ControlPosition[position]].push(compiled[0]);

          });

        });
      }
    };
  }]);;// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('featureCollection', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',      // a geojson object
        onInit: '=?',      // function()
        opacity: '=?',     // function()
        options: '=?',     // function() { return {} }
        url: '=?',         // url to a geojson file
        visible: '=?'     // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          // Defaut values for options and events
          if (!$scope.options) $scope.options = {};
          if (!$scope.events) $scope.events = {};

          // Which dataset to use. Raw geojson prefered over URL
          if ($scope.geojson) {
            newData($scope.geojson);
          } else if ($scope.url) {
            $http.get(url).then(function(success, error) {
              newData(success.data);
            });
          }

          // Get options of a given type
          function optionsOfType(type, options) {
            var isFunction = typeof options[type] === "function";
            return isFunction ? options[type] : function() { return {}; };
          }

          // Get events of a given type
          function eventsOfType(type, events) {
            var isObject = typeof events[type] === 'object';
            return isObject ? events[type] : {};
          }

          // Accepts data in the form of geojson
          function newData(data) {

            var features = [];

            function newFeature(f){

              var type = f.geometry.type; // i.e. "Point" "MultiPolygon" etc.

              // Set options and events
              var options = optionsOfType(type, $scope.options);
              var events = eventsOfType(type, $scope.events);

              var feature = GeoJSON[type](f.geometry, f.properties, options, events, map);

              features.push(feature.getMapFeature());

              $scope.$watch('options', function(newOptions) {
                if (!newOptions) return;
                feature.setOptions(optionsOfType(type, newOptions));
              });

              $scope.$watch('opacity', function(opacity) {
                if (opacity && feature.setOpacity) feature.setOpacity(opacity);
              });

              $scope.$watch('visible', function(visible) {
                if (typeof visible === "boolean") feature.setVisible(visible);
              });

            }

            // For each feature in the feature collection
            for (var i=0; i<data.features.length; i++) {

              newFeature(data.features[i]);

            }

            if ($scope.onInit) $scope.onInit(features, data);

          }

        });

      }
    };
  }]);
;angular.module('ngMaps')
  .directive('geopoints', ['$http', function($http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',         // string  
        events: '=',      // object {event:function(), event:function()}
        visible: '=',     // boolean
        options: '=',     // function() { return {} }
        onInit: '='       // function()
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var markers = [];

          // If the options changes restyle each element
          $scope.$watch(function() {
            return $scope.options;
          }, function() {
            angular.forEach(markers, function(m, i) {
              marker.setOptions($scope.options(m.geometry, m.properties, map, i));
            });
          });

          // If visibility changes rerender visibility
          $scope.$watch(function() {
            return $scope.visible;
          }, function() {
              angular.forEach(markers, function(marker) {
                  marker.setVisible($scope.visible);
              });
          });

          $scope.$watch(function() {
            return $scope.url;
          }, function() {
            newData($scope.url);
          });

          function newData(url) {

            // AJAX request to get GeoJSON
            // The goal is to create an object that mimics a Google Map Data Layer
            $http.get(url).success(function(data) {

              angular.forEach(markers, function(m) {
                m.setMap(null);
              });

              markers = [];

              angular.forEach(data.features, function(m, i) {

                var opts = $scope.options ? $scope.options(m.geometry, m.properties, map, i) : {};

                // Initial options since markers require a map and position
                opts.position = new google.maps.LatLng(m.geometry.coordinates[1], m.geometry.coordinates[0]);
                opts.visible = $scope.visible;
                opts.map = map;

                // Create the marker
                var marker = new google.maps.Marker(opts);

                // Assign properties to marker
                marker.properties = m.properties;

                // Assign geometry to marker
                marker.geometry = m.geometry;

                // Helper function so multimarkers' API matches data layer
                marker.getProperty = function(p) {
                  return this.properties[p];
                };

                // Add marker to list of markers
                markers.push(marker);

                // For each event, add a listener. Also provides access to the map and parent scope
                angular.forEach($scope.events, function(val, key) {
                  google.maps.event.addListener(marker, key, function(e) {
                    val(e, marker, map, markers);
                  });
                });

              });

              if ($scope.onInit) $scope.onInit(markers);

            });

          };

        });
      }
    };
  }]);;angular.module('ngMaps')
  .directive('geopolygons', ['$http', function($http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',     // string
        events: '=',  // object {event:function(), event:function()}
        options: '=', // function() { return {} }
        visible: '=', // boolean
        opacity: '=', // int 0 -> 100
        onInit: '='   // function()
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Get the map
          var map = parent.getMap();

          // Array of all polygons
          var polygons = [];

          // Watch options
          $scope.$watch('options', function() {
            angular.forEach(polygons, function(p, i) {
              var opts = $scope.options ? $scope.options(p.geometry, p.properties, map, i) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;
              p.setOptions(opts);
            });
          });

          // Watch opacity
          $scope.$watch('opacity', function() {
            if($scope.opacity) {
              angular.forEach(polygons, function(p) {
                p.setOptions({fillOpacity: $scope.opacity / 100});
              });
            }
          });

          $scope.$watch('visible', function() {
            angular.forEach(polygons, function(p) {
              p.setVisible($scope.visible);
            });
          });

          // When the URL changes, make new polygons
          $scope.$watch('url', function() {
            newData($scope.url);
          });

          // Takes a polygon or multipolygon and adds additional funtionality
          function PolygonCollection(p, i) {

            this.type = p.geometry.type;
            this.properties = p.properties;

            this.setOptions = function(o) {
              angular.forEach(polygons, function(p) {
                p.setOptions(o);
              });
            };

            this.setVisible = function(o) {
              angular.forEach(polygons, function(p) {
                p.setVisible(o);
              });
            };

            this.getMap = function(o) {
              angular.forEach(polygons, function(p) {
                p.getMap(o);
              });
            };

            // All of the polygon objects in this collection
            var polygons = [];

            var opts = $scope.options ? $scope.options(p.geometry, p.properties, i, map) : {};
            opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;

            if (this.type === "MultiPolygon") {

              angular.forEach(p.geometry.coordinates, function(c) {
                angular.forEach(c, function(c2) {
                  // Each c2 is a single polygon
                  var coords = [];
                  // Create google map latlngs
                  angular.forEach(c2, function(c3) {
                    coords.push(new google.maps.LatLng(c3[1], c3[0]))
                  });
                  // New polygon
                  var polygon = new google.maps.Polygon({
                    paths: coords
                  });
                  // Set options and map
                  polygon.setOptions(opts);
                  polygon.setMap(map);
                  // Add to polygon array
                  polygons.push(polygon);
                });
              });

            } else { // Normal polygon

              var coords = [];
              angular.forEach(p.geometry.coordinates, function(c) {
                // Create google map latlngs
                angular.forEach(c, function(c2) {
                  coords.push(new google.maps.LatLng(c2[1], c2[0]))
                });
              });
              // New polygon
              var polygon = new google.maps.Polygon({
                paths: coords
              });
              // Set options and map
              polygon.setOptions(opts);
              polygon.setMap(map);
              // Add to polygon array
              polygons.push(polygon);

            }

            this.polygons = polygons;

          };
 

          function newData(url) {

            // Fetch the data
            $http.get(url).success(function(data) {

              // Remove each existing polygon from the map
              angular.forEach(polygons, function(p) {
                p.setMap(null);
              });
              
              // Reset polygon array
              polygons = [];

              // For each poly OR multipoly, 
              angular.forEach(data.features, function(p, i) {

                  var PC = new PolygonCollection(p, i);

                  polygons.push(PC);

                  angular.forEach(PC.polygons, function(polygon) {
                    angular.forEach($scope.events, function(val, key) {
                      google.maps.event.addListener(polygon, key, function(e) {
                        val(e, PC, map, polygons);
                      });
                    });
                  })
                  
              });

              // Fire onInit function now that data is loaded
              if ($scope.onInit) $scope.onInit(polygons);

            });

          };

          

        });
      }
    };
  }]);;angular.module('ngMaps')
  .directive('infowindow', ['$compile', function($compile) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        position: '=',    // string, camelcase i.e. topLeft, rightBottom
        visible: '=',
        events: '='
      },
      require: '^map',
      compile: function(tElement, tAttrs) {

        return function($scope, $element, $attrs, parent) {

          $scope.$watch(function() {
            parent.getMap();
          }, function() {

            var map = parent.getMap();

            var opts = $scope.options? $scope.options() : {};

            var infowindow = new google.maps.InfoWindow(opts);

            $scope.$watch(function() {
              $element[0].style.display = "none";
              return $element[0].innerHTML + $scope.position;
            }, function(oldVal, newVal) {
              
              var pos;

              if ($scope.position.constructor === Array) {
                pos = new google.maps.LatLng($scope.position[0], $scope.position[1]);
              } else {
                pos = $scope.position;
              }

              // TODO: event handling

              var content = $element.html();
              var compiled = $compile($element.html())($scope.$parent.$parent);

              infowindow.setContent(compiled[0]);
              infowindow.setPosition(pos);
              infowindow.open(map);

            });

          });
        };
      }
    };
  }]);;angular.module('ngMaps')
  .directive('kml', [function() {
    return {
      restrict: 'E',
      scope: {
        url: '=',     // string
        events: '=',  // object - ex. {click: function(event, kml, map) { /* ... */ } }
        visible: '=', // boolean
        options: '='  // function() { return { preserveViewport: true } }
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          function delete_kml() {
            if (kml) {
              kml.setMap(null);
              kml = null;
            }
          };

          function new_kml() {
            delete_kml();

            var options = $scope.options? $scope.options() : {};
            options.url = $scope.url;
            options.map = map;

            var kml = new google.maps.KmlLayer(options);

            // For each event, add a listener. Also provides access to the kml
            // and map, in case the listener needs to access them
            angular.forEach($scope.events, function(val, key) {
              google.maps.event.addListener(kml, key, function(e) {
                val(e, kml, map);
              });
            });

            if ($scope.visible !== false) {
              kml.setMap(map);
            } else {
              kml.setMap(null);
            }

            return kml;
          };

          var kml = new_kml();

          $scope.$watch('url', function() {
            kml = new_kml();
          });

          $scope.$watch('visible', function() {
            if ($scope.visible !== false) {
              kml.setMap(map);
            } else {
              kml.setMap(null);
            }
          });
        });
      }
    };
  }]);
;// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('linestring', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        coordinates: '=?', // [[p1,p2,p3],[p4,p5]]
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',     // a geojson object
        onInit: '=?',      // function()
        opacity: '=?',     // number < 100
        options: '=?',     // function() { return {} }
        properties: '=?',  // object {}
        url: '=?',         // string url to a geojson file
        visible: '=?'      // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          if (!$scope.options) $scope.options = function() { return {}; };
          if (!$scope.events) $scope.events = {};

          // Which dataset to use. Raw geojson prefered over URL
          if ($scope.geojson) {
            newData($scope.geojson);
          } else if ($scope.coordinates) {
            newData({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: $scope.coordinates
              },
              properties: $scope.properties || null
            });
          } else if ($scope.url) {
            $http.get(url).then(function(success, error) {
              newData(success.data);
            });
          }

          // Accepts data in the form of geojson
          function newData(data) {

            var feature = GeoJSON["LineString"](data.geometry, data.properties, $scope.options, $scope.events, map);

            $scope.$watch('coordinates', function(coords) {
              if (coords) feature.setPath(coords);
            }, true);

            $scope.$watch('geojson.geometry.coordinates', function(coords) {
              if (coords) feature.setPath(coords);
            }, true);

            $scope.$watch('options', function(newOptions) {
              if (newOptions) feature.setOptions(newOptions);
            });

            $scope.$watch('properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('geojson.properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch(function() { return $scope.opacity; },
              function(opacity) {
                if (opacity && feature.setOpacity) feature.setOpacity(opacity);
              });

            $scope.$watch(function() { return $scope.visible; },
              function(visible) {
                if (typeof visible === "boolean") feature.setVisible(visible);
              });

            if ($scope.onInit) $scope.onInit(feature, data);

          };

        });

      }
    };
  }]);

;angular.module('ngMaps')
  .directive('map', [function() {
    return {
      restrict: 'AE',
      scope: {
        center: '=',      // array [lat, lng]
        zoom: '=',        // int
        events: '=',      // object {event:function(), event:function()}
        options: '=',     // function() { return {} }
      },
      controller: function($scope) {
        // This function allows child directives to access the map
        this.getMap = function() {
          return $scope.map;
        };
      },
      transclude: true,
      link: function($scope, elem, attrs) {

        var center = $scope.center;

        var options = $scope.options? $scope.options() : {};

        var latitude = center ? center[0] : 47.6;
        var longitude = center ? center[1] : -122.3;

        options.center = new google.maps.LatLng(latitude, longitude);

        if ($scope.zoom) {
          options.zoom = $scope.zoom;
        } else if (!options.zoom) {
          options.zoom = 6; // default
        }

        $scope.$watch("center", function(center) {
          if (center) map.panTo(new google.maps.LatLng(center[0], center[1]));
        });

        // Create div for the map to be drawn in which inherits the parent classes
        var t1 = document.createElement('div');
        t1.className = attrs.class;
        elem.append(t1);

        var map = new google.maps.Map(t1, options);

        // For each event, add a listener. Also provides access to the map
        angular.forEach($scope.events, function(val, key) {
          google.maps.event.addListener(map, key, function(e) {
            val(e, map);
          });
        });

        $scope.map = map;

      }
    };
  }]);
;angular.module('ngMaps')
  .directive('marker', [function() {
    return {
      restrict: 'E',
      scope: {
        position: '=',    // array [lat, lng]
        options: '=',     // function() { return {} }
        events: '=',      // object {event:function(), event:function()}
        lat: '=',         // float
        lng: '=',         // float
        decimals: '='     // Int
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var decimals = $scope.decimals;

          var opts = $scope.options? $scope.options() : {};

          function round(val) {
            if (decimals || decimals === 0) {
              return Math.round(Math.pow(10, decimals) * val) / Math.pow(10, decimals);
            } else {
              return val;
            }
          };

          function currentPosition() {
            if ($scope.position) {
              return new google.maps.LatLng($scope.position[0], $scope.position[1]);
            } else if ($scope.lat && $scope.lng) {
              return new google.maps.LatLng($scope.lat, $scope.lng);
            }
          };

          opts.position = currentPosition();
          opts.map = map;

          var marker = new google.maps.Marker(opts);

          // For each event, add a listener. Also provides access to the map and parent scope
          angular.forEach($scope.events, function(val, key) {
            google.maps.event.addListener(marker, key, function(e) {
              val(e, marker, map);
            });
          });

          // Watch for changes in position and move marker when they happen
          $scope.$watch('[position, lat, lng]', function() {
            marker.setPosition(currentPosition());
          }, true);

          // When the marker is dragged, update the scope with its new position
          google.maps.event.addListener(marker, "drag", function() {
            $scope.$apply(function() {
              var lat = round(marker.getPosition().lat());
              var lng = round(marker.getPosition().lng());
              if ($scope.position) {
                $scope.position = [lat, lng];
              } else if ($scope.lat && $scope.lng) {
                $scope.lat = lat;
                $scope.lng = lng;
              }
            });
          });

        });
      }
    };
  }]);;angular.module('ngMaps')
  .directive('overlay', [function() {

    //TODO add events

    return {
      restrict: 'E',
      scope: {
        url: '=',     // String, path to image
        events: '=',
        opacity: '=', // 0 <= Int <= 100
        options: '=',
        bounds: '=',  // Array of SW, NE OR Google bounds object
        visible: '='  // Boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          function isFloat(n) {
            return n === +n && n !== (n || 0);
          }

          function parseOpacity() {
            if (isFloat($scope.opacity)) {
              return $scope.opacity;
            } else {
              return parseFloat($scope.opacity);
            }
          };

          function deleteOverlay() {
            if (overlay) {
              overlay.setMap(null);
              overlay = null;
            }
          };

          function newOverlay() {

            // Remove previous overlay
            deleteOverlay();

            var bounds; 

            if ($scope.bounds.constructor === Object) {
              var SW = new google.maps.LatLng($scope.bounds.SW[0], $scope.bounds.SW[1]);
              var NE = new google.maps.LatLng($scope.bounds.NE[0], $scope.bounds.NE[1]);
              bounds = new google.maps.LatLngBounds(SW,NE);  
            } else {
              bounds = $scope.bounds;
            }

            var opts = $scope.options? $scope.options() : {};

            // Make new overlay
            var overlay = new google.maps.GroundOverlay($scope.url, bounds, opts);

            // Set opacity
            overlay.setOpacity(parseOpacity() / 100);

            // Set visible
            if ($scope.visible !== false) {
              overlay.setMap(map);
            } else {
              overlay.setMap(null);
            }

            return overlay;
          };

          var overlay = newOverlay();

          $scope.$watch('url + bounds', function() {
            overlay = newOverlay();
          });

          $scope.$watch('opacity', function() {
            overlay.setOpacity(parseOpacity() / 100);
          });

          $scope.$watch('visible', function() {
            if ($scope.visible !== false) {
              overlay.setMap(map);
            } else {
              overlay.setMap(null);
            }
          });

        });

      }

    };

  }]);;// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('point', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        decimals: '=?',    // how many decimals to round to when dragged
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',     // a geojson object
        latitude: '=?',    // number (unique to point)
        longitude: '=?',   // number (unique to point)
        onInit: '=?',      // function()
        onMove: '=?',
        options: '=?',     // function() { return {} }
        properties: '=?',  // object {}
        url: '=?',         // string url to a geojson file
        visible: '=?'      // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          function round(n) {
            if (!isNaN($scope.decimals)) {
              return Math.round(Math.pow(10, $scope.decimals) * n) / Math.pow(10, $scope.decimals);
            } else {
              return n;
            }
          }

          if (!$scope.options) $scope.options = function() { return {}; };
          if (!$scope.events) $scope.events = {};

          // Which dataset to use. Raw geojson prefered over URL
          if ($scope.geojson) {
            newData($scope.geojson);
          } else if (!isNaN($scope.latitude) && !isNaN($scope.longitude)) {
            newData({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [$scope.longitude, $scope.latitude]
              },
              properties: $scope.properties || null
            });
          } else if ($scope.url) {
            $http.get(url).then(function(success, error) {
              newData(success.data);
            });
          }

          // Accepts data in the form of geojson
          function newData(data) {

            var feature = GeoJSON.Point(data.geometry, data.properties, $scope.options, $scope.events, map);

            $scope.$watch('[longitude, latitude]', function(coords) {
              if (coords) feature.setPosition(coords);
            }, true);

            $scope.$watch('geojson.geometry.coordinates', function(coords) {
              if (coords) feature.setPosition(coords);
            }, true);

            $scope.$watch('properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('geojson.properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('options', function(newOptions) {
              if (newOptions) feature.setOptions(newOptions);
            });

            $scope.$watch('visible', function(visible) {
              if (typeof visible === "boolean") feature.setVisible(visible);
            });

            if ($scope.onInit) $scope.onInit(feature, data);

            google.maps.event.addListener(feature.getMapFeature(), "drag", function() {
              $scope.$apply(function() {
                var lat = round(feature.getMapFeature().getPosition().lat());
                var lng = round(feature.getMapFeature().getPosition().lng());
                if ($scope.geojson) {
                  $scope.geojson.geometry.coordinates = [lng, lat];
                } else if (!isNaN($scope.latitude) && !isNaN($scope.longitude)) {
                  $scope.latitude = lat;
                  $scope.longitude = lng;
                }
              });
            });

          }

        });

      }
    };
  }]);
;angular.module('ngMaps')
  .directive('points', [function() {
    return {
      restrict: 'E',
      scope: {
        coords: '=',        // array []
        options: '=',       // function() { return {} }
        properties: '=',    // array [{}, {}]
        events: '=',        // object {event:function(), event:function()}
        visible: '=',       // boolean
        decimals: '='       // int
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var points = [];

          var properties = $scope.properties ? $scope.properties : [];

          function round(val) {
            if ($scope.decimals || $scope.decimals === 0) {
              return Math.round(Math.pow(10, $scope.decimals) * val) / Math.pow(10, $scope.decimals);
            } else {
              return val;
            }
          };

          $scope.$watch('coords', function() {
            newCoords($scope.coords);
          });

          $scope.$watch('visible', function() {
            angular.forEach(points, function(c) {
              c.setVisible($scope.visible);
            });
          });

          $scope.$watch('options', function() {
            angular.forEach(points, function(c, i) {
              c.setOptions($scope.options(c, properties, map, i));
            });
          });

          function newCoords(coords) {

            angular.forEach(points, function(p) {
              p.setMap(null);
            });

            points = [];

            angular.forEach(coords, function(c, i) {

              var opts = $scope.options ? $scope.options(c, properties, i, map) : {};
              opts.position = new google.maps.LatLng(c[0], c[1]);
              opts.map = map;
              var point = new google.maps.Marker(opts);

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(point, key, function(e) {
                  val(e, this, map, points);
                });
              });

              google.maps.event.addListener(point, "drag", function() {
                $scope.$apply(function() {
                  var lat = round(point.getPosition().lat());
                  var lng = round(point.getPosition().lng());
                  $scope.coords[i] = [lat, lng];
                });
              });

              points.push(point);

            });

          };



        });

      }
    };
  }]);;// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('polygon', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        coordinates: '=?', // [[p1,p2,p3],[p4,p5]]
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',     // a geojson object
        onInit: '=?',      // function()
        opacity: '=?',     // number < 100
        options: '=?',     // function() { return {} }
        properties: '=?',  // object {}
        url: '=?',         // string url to a geojson file
        visible: '=?'      // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          if (!$scope.options) $scope.options = function() { return {}; };
          if (!$scope.events) $scope.events = {};

          // Which dataset to use. Raw geojson prefered over URL
          if ($scope.geojson) {
            newData($scope.geojson);
          } else if ($scope.coordinates) {
            newData({
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: $scope.coordinates
              },
              properties: $scope.properties || null
            });
          } else if ($scope.url) {
            $http.get(url).then(function(success, error) {
              newData(success.data);
            });
          }

          // Accepts data in the form of geojson
          function newData(data) {

            var feature = GeoJSON["Polygon"](data.geometry, data.properties, $scope.options, $scope.events, map);

            $scope.$watch('coordinates', function(coords) {
              if (coords) feature.setPath(coords);
            }, true);

            $scope.$watch('geojson.geometry.coordinates', function(coords) {
              if (coords) feature.setPath(coords);
            }, true);

            $scope.$watch('options', function(newOptions) {
              if (newOptions) feature.setOptions(newOptions);
            });

            $scope.$watch('properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('geojson.properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch(function() { return $scope.opacity; },
              function(opacity) {
                if (opacity && feature.setOpacity) feature.setOpacity(opacity);
              });

            $scope.$watch(function() { return $scope.visible; },
              function(visible) {
                if (typeof visible === "boolean") feature.setVisible(visible);
              });

            if ($scope.onInit) $scope.onInit(feature, data);

          };

        });

      }
    };
  }]);

;angular.module('ngMaps')
  .directive('polygons', [function() {
    return {
      restrict: 'E',
      scope: {
        coords: '=',        // array TODO change this to bounds
        options: '=',       // function() { return {} }
        properties: '=',    // array [{}, {}]
        opacity: '=',       // int
        events: '=',
        visible: '='        // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Get the map
          var map = parent.getMap();

          // Array of all polygons
          var polygons = [];

          var properties = $scope.properties ? $scope.properties : [];

          // Watch options
          $scope.$watch('options', function() {
            angular.forEach(polygons, function(p) {
              var opts = $scope.options ? $scope.options(p, properties, i, map) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;
              p.setOptions(opts);
            });
          });

          // Watch opacity
          $scope.$watch('opacity', function() {
            angular.forEach(polygons, function(p) {
              p.setOptions({fillOpacity: $scope.opacity / 100});
            });
          });

          $scope.$watch('visible', function() {
            angular.forEach(polygons, function(p) {
              p.setVisible($scope.visible);
            });
          });

          // When the coords changes, make new polygons
          $scope.$watch('coords', function() {
            newData($scope.coords);
          });

          function newData(coords) {

            // Remove each existing polygon from the map
            angular.forEach(polygons, function(p) {
              p.setMap(null);
            });
            
            // Reset polygon array
            polygons = [];

            angular.forEach(coords, function(c, i) {

              // create polygon options with set opacity
              var opts = $scope.options ? $scope.options(c, properties, map, i) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;
              opts.path = [];
              opts.map = map;

              // Express each coordinate pair as a google maps object
              for (var j = 0; j < c.length; j++) {
                for (var k = 0; k < c[j].length; k++) {
                  opts.path.push(new google.maps.LatLng(c[j][k][0], c[j][k][1]));
                }
              }

              // Create a new polygon
              var polygon = new google.maps.Polygon(opts);

              // Assign properties to polygon for some use
              if($scope.properties) {
                polygon.properties = $scope.properties[i];
              }

              // Helper function so multimarkers' API matches data layer
              // Do I really need this?
              polygon.getProperty = function(p) {
                return this.properties[p];
              };

              // Add to polygons array
              polygons.push(polygon);

              // For each event, add a listener. Also provides access to the map and parent scope
              // For some reason, the val function requires "this" instead of "polygon"
              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(polygon, key, function(e) {
                  val(e, this, map, polygons);
                });
              });


            });

          };

        });
      }
    };
  }]);
;angular.module('ngMaps')
  .directive('polylines', [function() {
    return {
    restrict: 'E',
    scope: {
      coords: '=',    // array [[[lat, lng]]]
      options: '=',   // function() { return {} }
      visible: '='    // boolean
    },
    require: '^map',
    link: function($scope, $element, $attrs, parent) {

      $scope.$watch(function() {
        parent.getMap();
      }, function() {

        var map = parent.getMap();

        var properties = $scope.properties ? $scope.properties : [];

        var lines = [];

        $scope.$watch('coords', function() {
          newData($scope.coords);
        });

        $scope.$watch('visible', function() {
          angular.forEach(lines, function(l) {
            l.setVisible($scope.visible);
          });
        });

        $scope.$watch('options', function() {
          angular.forEach(lines, function(l, i) {
            l.setOptions($scope.options(l, properties, map, i))
          });
        });

        function newData(coords) {

          angular.forEach(lines, function(l) {
            l.setMap(null);
          });

          lines = [];

          // loop through each array of array of coordinates
          angular.forEach(coords, function(l, i) {

            var opts = $scope.options ? $scope.options(l, properties, map, i) : {};
            opts.path = [];

            // loop through each array of coordinates
            angular.forEach(l, function(c) {
              opts.path.push(new google.maps.LatLng(c[0], c[1]));
            });

            opts.map = map;
            var polyline = new google.maps.Polyline(opts);

            lines.push(polyline);

            angular.forEach($scope.events, function(val, key) {
              google.maps.event.addListener(polyline, key, function(e) {
                val(e, this, map, lines);
              });
            });

          });

        };

        

      });

    }
  };
  }]);;angular.module('ngMaps')
  .directive('rectangles', ['$rootScope', function($rootScope) {
  return {
      restrict: 'E',
      scope: {
        bounds: '=',      // [ [ [[SW]],[[NE]] ] ] OR google maps LatLngBounds 
        events: '=',      // object {event:function(), event:function()}
        visible: '=',     // boolean
        options: '=',     // function() { return {} }
        opacity: '=',     // int
        decimals: '='     // int
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Set map
          var map = parent.getMap();

          var properties = $scope.properties ? $scope.properties : [];

          // List of circles
          var rectangles = [];

          var decimals = $scope.decimals;

          function round(val) {
            if (decimals || decimals === 0) {
              return Math.round(Math.pow(10, decimals) * val) / Math.pow(10, decimals);
            } else {
              return val;
            }
          };

          // Watch for changes in visibility
          $scope.$watch('visible', function() {
            angular.forEach(rectangles, function(r) {
              r.setVisible($scope.visible);
            });
          });

          // Watch for changes in options
          $scope.$watch('options', function() {
            angular.forEach(rectangles, function(r, i) {
              r.setOptions($scope.options(r, properties, map, i));
            });
          });

          // Watch for changes in data
          $scope.$watch('bounds', function() {
            newData();
          });

          // Watch for changes in opacity
          $scope.$watch('opacity', function() {
            if ($scope.opacity) {
              angular.forEach(rectangles, function(r) {
                r.setOptions({fillOpacity: $scope.opacity / 100});
              });
            }
          });

          // Make a new collection of circles
          var newData = function() {

            // Remove each object from map
            angular.forEach(rectangles, function(r){
              r.setMap(null);
            });

            // Delete objects
            rectangles = [];

            // Create new objects
            angular.forEach($scope.bounds, function(r, i) {

              console.log(r)

              var opts = $scope.options ? $scope.options(r, properties, map, i) : {};

              // This assumes that if bounds isn't an array it's already a LatLngBounds object
              if (r.constructor === Object) {
                var SW = new google.maps.LatLng(r.SW[0], r.SW[1]);
                var NE = new google.maps.LatLng(r.NE[0], r.NE[1]);
                opts.bounds = new google.maps.LatLngBounds(SW,NE);  
              } else {
                opts.bounds = r;
              }

              opts.map = map;

              var rect = new google.maps.Rectangle(opts);
              rectangles.push(rect);

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(rect, key, function(e) {
                  val(e, this, i, rectangles);
                });
              });

              // If editable, apply bound changes to rootscope when the rectangle is edited
              google.maps.event.addListener(rect, 'bounds_changed', function() {
                var b = rect.getBounds();
                var SW = b.getSouthWest();
                var NE = b.getNorthEast();
                $scope.bounds[i] = { SW:[round(SW.k),round(SW.B)], NE:[round(NE.k),round(NE.B)]};
                $rootScope.$apply();
              });

            });
          };

          

          

        });

      }
    };
}]);;angular.module('ngMaps')
  .directive('textLabels', [function() {
    return {
      restrict: 'E',
      scope: {
        features: '=',    // array [{text, coords}]
        events: '=',      // object {event:function(), event:function()}
        visible: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var opts = $scope.options? $scope.options() : {};

          var textLabels = [];

          $scope.$watch("visible", function(visible) {
            if (visible !== false) {
              textLabels.forEach(function(f) { f.setMap(map); });
            } else {
              textLabels.forEach(function(f) { f.setMap(null); });
            }
          });

          angular.forEach($scope.features, function(feature) {

            textLabel = angular.extend(new google.maps.OverlayView(), {

              onAdd: function() {

                div = document.createElement('div');

                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';

                console.log($attrs.class)

                div.className = $attrs.class;
                div.innerHTML = feature.text;

                var panes = this.getPanes();
                panes.overlayMouseTarget.appendChild(div);

                angular.forEach($scope.events, function(val, key) {
                  div.addEventListener(key, function(e) {
                    val(e, feature, map, textLabels);
                  });
                });

                this.div_ = div;

              },
              draw: function() {

                var coords = feature.coords;

                var overlayProjection = this.getProjection();
                var pos = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(coords[0], coords[1]));

                var div = this.div_;

                var boundingRect = div.getBoundingClientRect();
                
                div.style.left = (pos.x - boundingRect.width/2) + 'px';
                div.style.top = (pos.y - boundingRect.height/2) + 'px';

              },
              onRemove: function() {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
              }
            });

            textLabel.setMap(map);

            textLabels.push(textLabel);

          });

          // opts.position = currentPosition();
          // opts.map = map;

          // var marker = new google.maps.Marker(opts);

          // // For each event, add a listener. Also provides access to the map and parent scope
          // angular.forEach($scope.events, function(val, key) {
          //   google.maps.event.addListener(marker, key, function(e) {
          //     val(e, marker, map);
          //   });
          // });

          // // Watch for changes in position and move marker when they happen
          // $scope.$watch('[position, lat, lng]', function() {
          //   marker.setPosition(currentPosition());
          // }, true);

          // // When the marker is dragged, update the scope with its new position
          // google.maps.event.addListener(marker, "drag", function() {
          //   $scope.$apply(function() {
          //     var lat = round(marker.getPosition().lat());
          //     var lng = round(marker.getPosition().lng());
          //     if ($scope.position) {
          //       $scope.position = [lat, lng];
          //     } else if ($scope.lat && $scope.lng) {
          //       $scope.lat = lat;
          //       $scope.lng = lng;
          //     }
          //   });
          // });

        });
      }
    };
  }]);