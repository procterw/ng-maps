angular.module('ng-data-map', []);;angular.module('ng-data-map')
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

  });;angular.module('ng-data-map')
  .directive('circles', ['MapObjects', function(MapObjects) {
  return {
      restrict: 'E',
      scope: {
        geometries: '=',
        events: '=',
        visible: '=',
        options: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Set map
          var map = parent.getMap();

          // List of circles
          var circleList = [];

          // Watch for changes in visibility
          $scope.$watch('visible', function() {
            angular.forEach(circleList, function(c) {
              c.setVisible($scope.visible)
            })
          })

          // Watch for changes in options
          $scope.$watch('options', function() {
            angular.forEach(circleList, function(c) {
              c.setOptions(options)
            })
          })

          // Watch for changes in data
          $scope.$watch('geometries', function() {
            newData();
          })

          // Make a new collection of circles
          newData = function() {

            // Remove each object from map
            angular.forEach(circleList, function(c){
              c.setMap(null);
            })

            // Delete objects
            circleList = [];

            // Create new objects
            angular.forEach($scope.geometries, function(c) {
              var opts = $scope.options ? $scope.options : {};
              opts.center = new google.maps.LatLng(c.center[0], c.center[1]);
              opts.radius = c.radius;
              opts.map = map;

              var circle = new google.maps.Circle(opts);
              circleList.push(circle)

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(circle, key, function(e) {
                  val(e, this, MapObjects);
                });
              });


            })
          }

          

          

        });

      }
    };
}]);angular.module('ng-data-map')
  .directive('control', function() {
    return {
      restrict: 'E',
      scope: {
        position: '@'
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
            controlDiv.innerHTML = $element[0].innerHTML;
            map.controls[google.maps.ControlPosition[position]].push(controlDiv);

          });


        });


      }
    };
  });;angular.module('ng-data-map')
  .directive('geopoints', ['MapObjects', '$http', function(MapObjects, $http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',
        events: '=',
        options: '=',
        visible: '='
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
            angular.forEach(markers, function(marker) {
              marker.setOptions($scope.options(marker, MapObjects));
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

                var opts = $scope.options ? $scope.options(m, MapObjects) : function() {
                  return {};
                };

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
                    val(e, marker, MapObjects, markers);
                  });
                });

              });

            });

          };

        });
      }
    };
  }]);;angular.module('ng-data-map')
  .directive('geopolygons', ['MapObjects', '$http', function(MapObjects, $http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',
        events: '=',
        options: '=',
        visible: '=',
        opacity: '='
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
          $scope.$watch(function() {
            return $scope.options;
          }, function() {
            angular.forEach(polygons, function(p) {
              var opts = $scope.options ? $scope.options(p, MapObjects) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;
              p.setOptions(opts);
            });
          });

          // Watch opacity
          $scope.$watch(function() {
            return $scope.opacity;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setOptions({fillOpacity: $scope.opacity / 100});
            });
          });

          $scope.$watch(function() {
            return $scope.visible;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setVisible($scope.visible);
            });
          });

          // When the URL changes, make new polygons
          $scope.$watch(function() {
            return $scope.url;
          }, function() {
            newData($scope.url);
          });

          var newData = function(url) {

            // Fetch the data
            $http.get(url).success(function(data) {

            // Remove each existing polygon from the map
            angular.forEach(polygons, function(p) {
              p.setMap(null);
            });
            
            // Reset polygon array
            polygons = [];

            angular.forEach(data.features, function(p, i) {

              // Express each coordinate pair as a google maps object
              for (var j = 0; j < p.geometry.coordinates.length; j++) {
                var coords = p.geometry.coordinates[j];
                for (var k = 0; k < coords.length; k++) {
                  coords[k] = new google.maps.LatLng(coords[k][1], coords[k][0]);
                }
              }

              // Create a new polygon
              var polygon = new google.maps.Polygon({
                paths: p.geometry.coordinates
              });

              // Create polygon options with opacity
              var opts = $scope.options ? $scope.options(p, MapObjects) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;

              // Set options
              polygon.setOptions(opts);

              // Set map
              polygon.setMap(map);

              // Assign properties to polygon for some use
              polygon.properties = p.properties;

              // Assign geometry to polygon for some use
              polygon.geometry = p.geometry;

              // Helper function so multimarkers' API matches data layer
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

          });

          };



        });
      }
    };
  }]);;angular.module('ng-data-map')
  .directive('infowindow', function() {
    return {
      restrict: 'E',
      scope: {
        position: '=',
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

              // if(oldVal != newVal) {

              infowindow.setContent($element[0].innerHTML);
              infowindow.setPosition($scope.position);
              infowindow.open(map);

              // }

            });

          });
        };
      }
    };
  });;angular.module('ng-data-map')
  .directive('map', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'AE',
      scope: {
        center: '=',  // Starting position
        zoom: '=',    // Starting zoom
        events: '=',  // Events
        options: '='  // Options
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
;angular.module('ng-data-map')
  .directive('marker', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        events: '=',
        position: '=',
        lat: '=',
        lng: '=',
        decimals: '='
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
  }]);;angular.module('ng-data-map')
  .directive('overlay', ['MapObjects', function(MapObjects) {

    return {
      restrict: 'E',
      scope: {
        url: '=',
        opacity: '=',
        bounds: '=',
        visible: '='
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
            deleteOverlay();
            var overlay = new google.maps.GroundOverlay($scope.url, $scope.bounds, {
              clickable: false
            });
            overlay.setOpacity(parseOpacity() / 100);
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

  }]);;angular.module('ng-data-map')
  .directive('points', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        coords: '=', //array of coordinate pairs
        options: '=',
        properties: '=',
        events: '=',
        visible: '=',
        decimals: '='
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

          var newCoords = function(coords) {

            angular.forEach(points, function(p) {
              p.setMap(null);
            });

            points = [];

            angular.forEach(coords, function(c, i) {

              var opts = $scope.options;
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

          $scope.$watch('coords', function() {
            newCoords($scope.coords);
          });

          $scope.$watch('visible', function() {
            angular.forEach(points, function(p) {
              p.setVisible($scope.visible);
            });
          });

        });

      }
    };
  }]);;angular.module('ng-data-map')
  .directive('polygons', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        coords: '=',
        options: '=',
        properties: '=',
        opacity: '=',
        visible: '='
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
          $scope.$watch(function() {
            return $scope.options;
          }, function() {
            angular.forEach(polygons, function(p) {
              var opts = $scope.options ? $scope.options(p, MapObjects) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;
              p.setOptions(opts);
            });
          });

          // Watch opacity
          $scope.$watch(function() {
            return $scope.opacity;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setOptions({fillOpacity: $scope.opacity / 100});
            });
          });

          $scope.$watch(function() {
            return $scope.visible;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setVisible($scope.visible);
            });
          });

          // When the coords changes, make new polygons
          $scope.$watch(function() {
            return $scope.coords;
          }, function() {
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

              var path = [];

              // Express each coordinate pair as a google maps object
              for (var j = 0; j < c.length; j++) {
                for (var k = 0; k < c[j].length; k++) {
                  console.log(c[j])
                  path.push(new google.maps.LatLng(c[j][k][0], c[j][k][1]));
                }
              }

              // Create a new polygon
              var polygon = new google.maps.Polygon({
                paths: path
              });

              // Assign properties to polygon for some use
              if($scope.properties) {
                polygon.properties = $scope.properties[i];
              }

              // Set map
              polygon.setMap(map);

              // Create polygon options with opacity
              var opts = $scope.options ? $scope.options(polygon, MapObjects) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;

              // Set options
              polygon.setOptions(opts);

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
;angular.module('ng-data-map')
  .directive('polylines', ['MapObjects', function(MapObjects) {
    return {
    restrict: 'E',
    scope: {
      coords: '=', //array of coordinate pairs
      options: '=',
      visible: '='
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

        $scipe.$watch('options', function() {
          angular.forEach(lines, function(l) {
            l.setOptions($scope.options)
          });
        });

        var newData = function(coords) {

          angular.forEach(lines, function(l) {
            l.setMap(null);
          });

          lines = [];

          // loop through each array of array of coordinates
          angular.forEach(coords, function(l) {

            var line = [];

              // loop through each array of coordinates
              angular.forEach(l, function(c) {
                line.push(new google.maps.LatLng(c[0], c[1]));
              });

            var opts = $scope.options;
            opts.path = line;
            opts.map = map;
            var polyline = new google.maps.Polyline(opts);

            lines.push(polyline);

          });
        };

        

      });

    }
  };
  }]);;angular.module('ng-data-map')
  .directive('rectangles', ['MapObjects', function(MapObjects) {
  return {
      restrict: 'E',
      scope: {
        geometries: '=',
        events: '=',
        visible: '=',
        options: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          // LOOK AT CIRCLES.JS for more
          

        });

      }
    };
}]);