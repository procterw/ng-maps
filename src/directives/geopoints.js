angular.module('ng-data-map')
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

          var url = $scope.url;

          var options = $scope.options ? $scope.options : function() {
            return {};
          };

          var markers = [];

          // If the style changes restyle each element
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

          // AJAX request to get GeoJSON
          // The goal is to create an object that mimics a Google Map Data Layer
          $http.get(url).success(function(data) {

            angular.forEach(data.features, function(m, i) {

              // Initial options since markers require a map and position
              var opts = {
                map: map,
                position: new google.maps.LatLng(m.geometry.coordinates[1], m.geometry.coordinates[0])
              };

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

              // Set options
              marker.setOptions(options(marker, MapObjects));

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

        });
      }
    };
  }]);