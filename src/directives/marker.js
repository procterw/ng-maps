angular.module('ngMaps')
  .directive('marker', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        events: '=',
        position: '=',
        lat: '=',
        lng: '=',
        decimals: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var decimals = $scope.decimals;

          var events = $scope.events ? $scope.events : {};

          var options = $scope.options ? $scope.options : {};

          var round = function(val) {
            if (decimals || decimals === 0) {
              return Math.round(Math.pow(10, decimals) * val) / Math.pow(10, decimals);
            } else {
              return val;
            }
          };

          var curPosition = function() {
            if ($scope.position) {
              return new google.maps.LatLng($scope.position[0], $scope.position[1]);
            } else if ($scope.lat && $scope.lng) {
              return new google.maps.LatLng($scope.lat, $scope.lng);
            }
          };

          options.position = curPosition();
          options.map = map;

          var marker = new google.maps.Marker(options);

          // For each event, add a listener. Also provides access to the map and parent scope
          angular.forEach(events, function(val, key) {
            google.maps.event.addListener(marker, key, function(e) {
              val(e, MapObjects);
            });
          });

          // Watch for changes in position and move marker when they happen
          $scope.$watch('[position, lat, lng]', function() {
            marker.setPosition(curPosition());
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