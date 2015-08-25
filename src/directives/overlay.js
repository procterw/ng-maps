angular.module('ngMaps')
  .directive('overlay', [function() {

    //TODO add events

    return {
      restrict: 'E',
      scope: {
        url: '=',     // String, path to image
        events: '=',
        opacity: '=', // 0 <= Int <= 100
        options: '=',
        bounds: '=',  // Array of SW, NE OR Google bounds object
        visible: '='  // Boolean
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

          function parseOpacity() {
            if (isFloat($scope.opacity)) {
              return $scope.opacity;
            } else {
              return parseFloat($scope.opacity);
            }
          };

          function deleteOverlay() {
            if (overlay) {
              overlay.setMap(null);
              overlay = null;
            }
          };

          function newOverlay() {

            // Remove previous overlay
            deleteOverlay();

            var bounds; 

            if ($scope.bounds.constructor === Object) {
              var SW = new google.maps.LatLng($scope.bounds.SW[0], $scope.bounds.SW[1]);
              var NE = new google.maps.LatLng($scope.bounds.NE[0], $scope.bounds.NE[1]);
              bounds = new google.maps.LatLngBounds(SW,NE);  
            } else {
              bounds = $scope.bounds;
            }

            var opts = $scope.options? $scope.options() : {};

            // Make new overlay
            var overlay = new google.maps.GroundOverlay($scope.url, bounds, opts);

            // Set opacity
            overlay.setOpacity(parseOpacity() / 100);

            // Set visible
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