angular.module('ngMaps')
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

  }]);