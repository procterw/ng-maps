angular.module('ngMaps')
  .directive('marker', [function() {
    return {
      restrict: 'E',
      scope: {
        position: '=',    // array [lat, lng]
        options: '=',     // function() { return {} }
        events: '=',      // object {event:function(), event:function()}
        lat: '=',         // float
        lng: '=',         // float
        decimals: '='     // Int
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var decimals = $scope.decimals;

          var opts = $scope.options? $scope.options() : {};

          function round(val) {
            if (decimals || decimals === 0) {
              return Math.round(Math.pow(10, decimals) * val) / Math.pow(10, decimals);
            } else {
              return val;
            }
          };

          function currentPosition() {
            if ($scope.position) {
              return new google.maps.LatLng($scope.position[0], $scope.position[1]);
            } else if ($scope.lat && $scope.lng) {
              return new google.maps.LatLng($scope.lat, $scope.lng);
            }
          };

          opts.position = currentPosition();
          opts.map = map;

          var marker = new google.maps.Marker(opts);

          // For each event, add a listener. Also provides access to the map and parent scope
          angular.forEach($scope.events, function(val, key) {
            google.maps.event.addListener(marker, key, function(e) {
              val(e, marker, map);
            });
          });

          // Watch for changes in position and move marker when they happen
          $scope.$watch('[position, lat, lng]', function() {
            marker.setPosition(currentPosition());
          }, true);

          // When the marker is dragged, update the scope with its new position
          google.maps.event.addListener(marker, "drag", function() {
            $scope.$apply(function() {
              var lat = round(marker.getPosition().lat());
              var lng = round(marker.getPosition().lng());
              if ($scope.position) {
                $scope.position = [lat, lng];
              } else if ($scope.lat && $scope.lng) {
                $scope.lat = lat;
                $scope.lng = lng;
              }
            });
          });

        });
      }
    };
  }]);