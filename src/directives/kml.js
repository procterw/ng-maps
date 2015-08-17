angular.module('ngMaps')
  .directive('kml', [function() {
    return {
      restrict: 'E',
      scope: {
        url: '=',
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

            if ($scope.visible !== false) {
              kml.setMap(map);
            } else {
              kml.setMap(null);
            }

            return kml;
          };

          var kml = new_kml();

          $scope.$watch('url + bounds', function() {
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