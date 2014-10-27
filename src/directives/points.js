angular.module('ng-data-map')
  .directive('points', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        coords: '=', //array of coordinate pairs
        options: '=',
        events: '=',
        visible: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var points = [];

          var newCoords = function(coords) {

            angular.forEach(points, function(p) {
              p.setMap(null);
            });

            points = [];

            angular.forEach(coords, function(c) {
              var opts = $scope.options;
              opts.position = new google.maps.LatLng(c[0], c[1]);
              if(!$scope.clusterOptions) { opts.map = map };
              var point = new google.maps.Marker(opts);
              points.push(point)
            });

            // TODO add in more cluster options support
            if($scope.clusterOptions) { new MarkerClusterer(map, points) };

          }

          $scope.$watch('coords', function() {
            newCoords($scope.coords);
          });

          $scope.$watch('visible', function() {
            angular.forEach(points, function(p) {
              p.setVisible($scope.visible);
            })
          });

        });

      }
    };
  })