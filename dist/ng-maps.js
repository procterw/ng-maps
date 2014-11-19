angular.module('ngMaps', []);;angular.module('ngMaps')
  .factory('MapObjects', function() {

    var API = {};

    // Find closest point to coordinates in a feature collection
    // Currently just used for point data layers
    API.closest = function(coords1, data) {
      var closest;
      var dist = 1000000000;
      angular.forEach(data, function(feature) {
        var coords2 = feature.getGeometry().get();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(coords1, coords2);
        if (!closest || closest.distance > distance) {
          closest = {
            marker: feature,
            distance: distance
          };
        }
      });
      return closest.marker;
    };

    API.map = null;

    return API;

  });;angular.module('ngMaps')
  .directive('circles', ['MapObjects', function(MapObjects) {
  return {
      restrict: 'E',
      scope: {
        geometries: '=',  // array [{}, {}]
        events: '=',      // object {event:function(), event:function()}
        visible: '=',     // boolean
        options: '=',     // function() { return {} }
        opacity: '='      // int <= 100
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

          // Watch for changes in visibility
          $scope.$watch('visible', function() {
            angular.forEach(circles, function(c) {
              c.setVisible($scope.visible)
            })
          })

          // Watch for changes in options
          $scope.$watch('options', function() {
            angular.forEach(circles, function(c, i) {
              c.setOptions($scope.options(c, map, i, MapObjects));
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
          var newData = function() {

            // Remove each object from map
            angular.forEach(circles, function(c){
              c.setMap(null);
            })

            // Delete objects
            circles = [];

            // Create new objects
            angular.forEach($scope.geometries, function(c, i) {

              var opts = $scope.options ? $scope.options(c, map, i, MapObjects) : {};
              opts.center = new google.maps.LatLng(c.center[0], c.center[1]);
              opts.radius = c.radius;
              opts.map = map;

              var circle = new google.maps.Circle(opts);
              circles.push(circle)

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(circle, key, function(e) {
                  val(e, this, i, MapObjects, circles);
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

angular.module('ngMaps')
  .directive('control', function() {
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
            return $element[0].innerHTML;
          }, function() {

            var controlDiv = document.createElement('div');

            map.controls[google.maps.ControlPosition[position]].pop();
            if ($scope.visible !== false) { controlDiv.innerHTML = $element[0].innerHTML; }
            map.controls[google.maps.ControlPosition[position]].push(controlDiv);

          });
        });
      }
    };
  });;angular.module('ngMaps')
  .directive('geopoints', ['MapObjects', '$http', function(MapObjects, $http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',         // string  
        events: '=',      // object {event:function(), event:function()}
        visible: '=',     // boolean
        options: '=',     // function() { return {} }
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
              marker.setOptions($scope.options(m, map, i, MapObjects));
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

          var newData = function(url) {

            // AJAX request to get GeoJSON
            // The goal is to create an object that mimics a Google Map Data Layer
            $http.get(url).success(function(data) {

              angular.forEach(markers, function(m) {
                m.setMap(null);
              });

              markers = [];

              angular.forEach(data.features, function(m, i) {

                var opts = $scope.options ? $scope.options(m, map, i, MapObjects) : {};

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
                    val(e, marker, i, MapObjects, markers);
                  });
                });

              });

            });

          };

        });
      }
    };
  }]);;angular.module('ngMaps')
  .directive('geopolygons', ['MapObjects', '$http', function(MapObjects, $http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',     // string
        events: '=',  // object {event:function(), event:function()}
        options: '=', // function() { return {} }
        visible: '=', // boolean
        opacity: '='  // int <= 100
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
              var opts = $scope.options ? $scope.options(p, map, i, MapObjects) : {};
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

            var opts = $scope.options ? $scope.options(p, i, map, MapObjects) : {};
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
 




          var newData = function(url) {

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
                        val(e, PC, MapObjects);
                      });
                    });
                  })
                  
              });

            });

          };



        });
      }
    };
  }]);;angular.module('ngMaps')
  .directive('infowindow', function() {
    return {
      restrict: 'E',
      scope: {
        position: '=',    // string, camelcase i.e. topLeft, rightBottom
      },
      require: '^map',
      compile: function(tElement, tAttrs) {

        return function($scope, $element, $attrs, parent) {

          $scope.$watch(function() {
            parent.getMap();
          }, function() {

            var map = parent.getMap();

            var infowindow = new google.maps.InfoWindow({
              content: null,
              position: null
            });

            $scope.$watch(function() {
              return $element[0].innerHTML + $scope.position;
            }, function(oldVal, newVal) {

              console.log("HUH")

              // if(oldVal != newVal) {

                if ($scope.position.constructor === Array) {
                  var pos = new google.maps.LatLng($scope.position[0], $scope.position[1]);
                } else {
                  var pos = $scope.position;
                }


                infowindow.setContent($element[0].innerHTML);
                infowindow.setPosition(pos);
                infowindow.open(map);

              // }

            });

          });
        };
      }
    };
  });;angular.module('ngMaps')
  .directive('map', ['MapObjects', function(MapObjects) {
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

        var events = $scope.events;
        var center = $scope.center;

        var options = $scope.options ? $scope.options : {};

        var latitude = center ? center[0] : 47.6;
        var longitude = center ? center[1] : -122.3;

        options.center = new google.maps.LatLng(latitude, longitude);
        options.zoom = $scope.zoom ? $scope.zoom : 8;

        var map = new google.maps.Map(elem[0], options);

        // For each event, add a listener. Also provides access to the map
        angular.forEach(events, function(val, key) {
          google.maps.event.addListener(map, key, function(e) {
            val(e, MapObjects);
          });
        });

        $scope.map = map;

      }
    };
  }]);
;angular.module('ngMaps')
  .directive('marker', ['MapObjects', function(MapObjects) {
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

          var events = $scope.events ? $scope.events : {};

          var options = $scope.options ? $scope.options : {};

          var round = function(val) {
            if (decimals || decimals === 0) {
              return Math.round(Math.pow(10, decimals) * val) / Math.pow(10, decimals);
            } else {
              return val;
            }
          };

          var curPosition = function() {
            if ($scope.position) {
              return new google.maps.LatLng($scope.position[0], $scope.position[1]);
            } else if ($scope.lat && $scope.lng) {
              return new google.maps.LatLng($scope.lat, $scope.lng);
            }
          };

          options.position = curPosition();
          options.map = map;

          var marker = new google.maps.Marker(options);

          // For each event, add a listener. Also provides access to the map and parent scope
          angular.forEach(events, function(val, key) {
            google.maps.event.addListener(marker, key, function(e) {
              val(e, MapObjects);
            });
          });

          // Watch for changes in position and move marker when they happen
          $scope.$watch('[position, lat, lng]', function() {
            marker.setPosition(curPosition());
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
  .directive('overlay', ['MapObjects', function(MapObjects) {

    return {
      restrict: 'E',
      scope: {
        url: '=',     // String, path to image
        opacity: '=', // 0 <= Int <= 100
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

          var parseOpacity = function() {
            if (isFloat($scope.opacity)) {
              return $scope.opacity;
            } else {
              return parseFloat($scope.opacity);
            }
          };

          var deleteOverlay = function() {
            if (overlay) {
              overlay.setMap(null);
              overlay = null;
            }
          };

          var newOverlay = function() {

            // Remove previous overlay
            deleteOverlay();

            var bounds; 

            // This assumes that if bounds isn't an array it's already a LatLngBounds object
            if ($scope.bounds.constructor === Array) {
              var SW = new google.maps.LatLng($scope.bounds[0][0], $scope.bounds[0][1]);
              var NE = new google.maps.LatLng($scope.bounds[1][0], $scope.bounds[1][1]);
              bounds = new google.maps.LatLngBounds(SW,NE);  
            } else {
              bounds = $scope.bounds;
            }

            // Make new overlay
            var overlay = new google.maps.GroundOverlay($scope.url, bounds, {
              clickable: false
            });

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

  }]);;angular.module('ngMaps')
  .directive('points', ['MapObjects', function(MapObjects) {
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

          var round = function(val) {
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
            angular.forEach(points, function(p) {
              p.setVisible($scope.visible);
            });
          });

          $scope.$watch('options', function() {
            angular.forEach(points, function(p, i) {
              p.setOptions($scope.options(p, map, i, MapObjects));
            });
          });

          var newCoords = function(coords) {

            angular.forEach(points, function(p) {
              p.setMap(null);
            });

            points = [];

            angular.forEach(coords, function(c, i) {

              var opts = $scope.options ? $scope.options(c, i, map, MapObjects) : {};
              opts.position = new google.maps.LatLng(c[0], c[1]);
              opts.map = map;
              var point = new google.maps.Marker(opts);

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(point, key, function(e) {
                  val(e, this, MapObjects);
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
  }]);;angular.module('ngMaps')
  .directive('polygons', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        coords: '=',        // array TODO change this to bounds
        options: '=',       // function() { return {} }
        properties: '=',    // array [{}, {}]
        opacity: '=',       // int
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

          // Watch options
          $scope.$watch('options', function() {
            angular.forEach(polygons, function(p) {
              var opts = $scope.options ? $scope.options(p, MapObjects) : {};
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

          var newData = function(coords) {

            // Remove each existing polygon from the map
            angular.forEach(polygons, function(p) {
              p.setMap(null);
            });
            
            // Reset polygon array
            polygons = [];

            angular.forEach(coords, function(c, i) {

              // create polygon options with set opacity
              var opts = $scope.options ? $scope.options(polygon, MapObjects) : {};
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
                  val(e, this, MapObjects);
                });
              });


            });

          };

        });
      }
    };
  }]);
;angular.module('ngMaps')
  .directive('polylines', ['MapObjects', function(MapObjects) {
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
          angular.forEach(lines, function(l) {
            l.setOptions($scope.options(l, map, MapObjects))
          });
        });

        var newData = function(coords) {

          angular.forEach(lines, function(l) {
            l.setMap(null);
          });

          lines = [];

          // loop through each array of array of coordinates
          angular.forEach(coords, function(l) {

            var opts = $scope.options ? $scope.options(l, map, MapObjects) : {};
            opts.path = [];

            // loop through each array of coordinates
            angular.forEach(l, function(c) {
              opts.path.push(new google.maps.LatLng(c[0], c[1]));
            });

            opts.map = map;
            var polyline = new google.maps.Polyline(opts);

            lines.push(polyline);

          });

        };

        

      });

    }
  };
  }]);;angular.module('ngMaps')
  .directive('rectangles', ['MapObjects', '$rootScope', function(MapObjects, $rootScope) {
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

          // List of circles
          var rectangles = [];

          var decimals = $scope.decimals;

          var round = function(val) {
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
              r.setOptions($scope.options(r, map, i, MapObjects));
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

              var opts = $scope.options ? $scope.options(r, map, i, MapObjects) : {};

              // This assumes that if bounds isn't an array it's already a LatLngBounds object
              if (r.constructor === Array) {
                var SW = new google.maps.LatLng(r[0][0], r[0][1]);
                var NE = new google.maps.LatLng(r[1][0], r[1][1]);
                opts.bounds = new google.maps.LatLngBounds(SW,NE);  
              } else {
                opts.bounds = r;
              }

              opts.map = map;

              var rect = new google.maps.Rectangle(opts);
              rectangles.push(rect);

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(rect, key, function(e) {
                  val(e, this, i, MapObjects, rectangles);
                });
              });

              // If editable, apply bound changes to rootscope when the rectangle is edited
              google.maps.event.addListener(rect, 'bounds_changed', function() {
                var b = rect.getBounds();
                var SW = b.getSouthWest();
                var NE = b.getNorthEast();
                $scope.bounds[i] = [[round(SW.k),round(SW.B)],[round(NE.k),round(NE.B)]];
                $rootScope.$apply();
              });

            });
          };

          

          

        });

      }
    };
}]);