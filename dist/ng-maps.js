angular.module('ngMaps', []);;angular.module('ngMaps')
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
          var newData = function() {

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

            map.controls[google.maps.ControlPosition[position]].pop();
            if ($scope.visible !== false) { controlDiv.innerHTML = content }
            map.controls[google.maps.ControlPosition[position]].push(compiled[0]);

          });

        });
      }
    };
  }]);;angular.module('ngMaps')
  .directive('geopoints', ['$http', function($http) {
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

          var newData = function(url) {

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
                        val(e, PC, map, polygons);
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

          opts.position = curPosition();
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

  }]);;angular.module('ngMaps')
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
            angular.forEach(points, function(c) {
              c.setVisible($scope.visible);
            });
          });

          $scope.$watch('options', function() {
            angular.forEach(points, function(c, i) {
              c.setOptions($scope.options(c, properties, map, i));
            });
          });

          var newCoords = function(coords) {

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
  }]);;angular.module('ngMaps')
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

          var newData = function(coords) {

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

        var newData = function(coords) {

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
}]);