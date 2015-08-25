angular.module('ngMaps')
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
