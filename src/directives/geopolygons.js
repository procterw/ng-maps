angular.module('ng-data-map')
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

          var map = parent.getMap();

          var url = $scope.url;

          var polygons = [];

          var options = $scope.options ? $scope.options : function() { return {} };

          $scope.$watch(function() {
            return $scope.options;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setOptions($scope.options(p, MapObjects));
            });
          });

          $scope.$watch(function() {
            return $scope.opacity;
          }, function() {
            angular.forEach(polygons, function(p) {
              p.setOptions({fillOpacity: $scope.opacity / 100});
            });
          });

          $http.get(url).success(function(data) {

            console.log(data)

            angular.forEach(data.features, function(p, i) {

              for(var j = 0; j < p.geometry.coordinates.length; j++) {

                var coords = p.geometry.coordinates[j]

                for (var k = 0; k < p.geometry.coordinates[j].length; k++) {

                  if(p.geometry.type === "MultiPolygon")
                  coords[k] = new google.maps.LatLng(coords[k][1], coords[k][0]);
                }

                var polygon = new google.maps.Polygon({
                  paths: coords
                });

                polygon.setOptions(options(p, MapObjects));

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

              };


            });

          });

        });
      }
    };
  }]);