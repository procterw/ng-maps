angular.module('ng-data-map')
  .directive('geopolygons', ['MapObjects', '$http', function(MapObjects, $http) {
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

          var url = $scope.url;

          var polygons = [];

          $scope.$watch(function() {
            return $scope.options;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setOptions($scope.options(p, MapObjects));
            });
          });

          $http.get(url).success(function(data) {

            angular.forEach(data.features, function(p, i) {

              // Express each coordinate pair as a google maps object
              for (var j = 0; j < p.geometry.coordinates.length; j++) {
                var coords = p.geometry.coordinates[j];
                for (var k = 0; k < coords.length; k++) {
                  coords[k] = new google.maps.LatLng(coords[k][1], coords[k][0]);
                }
              }

              var polygon = new google.maps.Polygon({
                paths: p.geometry.coordinates
              });

              polygon.setOptions($scope.options(p, MapObjects));

              polygon.setMap(map);

              // Assign properties to marker
              polygon.properties = p.properties;

              // Assign geometry to marker
              polygon.geometry = p.geometry;

              // Helper function so multimarkers' API matches data layer
              polygon.getProperty = function(p) {
                return this.properties[p];
              };

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

        });
      }
    };
  }]);