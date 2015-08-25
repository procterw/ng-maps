angular.module('ngMaps')
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
  }]);