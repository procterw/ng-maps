angular.module('ngMaps')
  .directive('points', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        coords: '=', //array of coordinate pairs
        options: '=',
        properties: '=',
        events: '=',
        visible: '=',
        decimals: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var points = [];

          var round = function(val) {
            if ($scope.decimals || $scope.decimals === 0) {
              return Math.round(Math.pow(10, $scope.decimals) * val) / Math.pow(10, $scope.decimals);
            } else {
              return val;
            }
          };

          var newCoords = function(coords) {

            angular.forEach(points, function(p) {
              p.setMap(null);
            });

            points = [];

            angular.forEach(coords, function(c, i) {

              var opts = $scope.options;
              opts.position = new google.maps.LatLng(c[0], c[1]);
              opts.map = map;
              var point = new google.maps.Marker(opts);

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(point, key, function(e) {
                  val(e, this, MapObjects);
                });
              });

              google.maps.event.addListener(point, "drag", function() {
                $scope.$apply(function() {
                  var lat = round(point.getPosition().lat());
                  var lng = round(point.getPosition().lng());
                  $scope.coords[i] = [lat, lng];
                });
              });

              points.push(point);

            });

          };

          $scope.$watch('coords', function() {
            newCoords($scope.coords);
          });

          $scope.$watch('visible', function() {
            angular.forEach(points, function(p) {
              p.setVisible($scope.visible);
            });
          });

        });

      }
    };
  }]);