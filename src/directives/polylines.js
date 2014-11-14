angular.module('ngMaps')
  .directive('polylines', ['MapObjects', function(MapObjects) {
    return {
    restrict: 'E',
    scope: {
      coords: '=', //array of coordinate pairs
      options: '=',
      visible: '='
    },
    require: '^map',
    link: function($scope, $element, $attrs, parent) {

      $scope.$watch(function() {
        parent.getMap();
      }, function() {

        var map = parent.getMap();

        var lines = [];

        $scope.$watch('coords', function() {
          newData($scope.coords);
        });

        $scope.$watch('visible', function() {
          angular.forEach(lines, function(l) {
            l.setVisible($scope.visible);
          });
        });

        $scope.$watch('options', function() {
          angular.forEach(lines, function(l) {
            l.setOptions($scope.options)
          });
        });

        var newData = function(coords) {

          angular.forEach(lines, function(l) {
            l.setMap(null);
          });

          lines = [];

          // loop through each array of array of coordinates
          angular.forEach(coords, function(l) {

            var line = [];

              // loop through each array of coordinates
              angular.forEach(l, function(c) {
                line.push(new google.maps.LatLng(c[0], c[1]));
              });

            var opts = $scope.options;
            opts.path = line;
            opts.map = map;
            var polyline = new google.maps.Polyline(opts);

            lines.push(polyline);

          });
        };

        

      });

    }
  };
  }]);