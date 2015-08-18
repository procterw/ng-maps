angular.module('ngMaps')
  .directive('kml', [function() {
    return {
      restrict: 'E',
      scope: {
        url: '=',
        events: '=',
        visible: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var delete_kml = function() {
            if (kml) {
              kml.setMap(null);
              kml = null;
            }
          };

          var new_kml = function() {
            delete_kml();

            var kml = new google.maps.KmlLayer({
                url: $scope.url,
                map: map
            });

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
