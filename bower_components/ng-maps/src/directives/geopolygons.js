angular.module('ngMaps')
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
  }]);