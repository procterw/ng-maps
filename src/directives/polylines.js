angular.module('ngMaps')
  .directive('polylines', [function() {
    return {
    restrict: 'E',
    scope: {
      coords: '=',    // array [[[lat, lng]]]
      options: '=',   // function() { return {} }
      visible: '='    // boolean
    },
    require: '^map',
    link: function($scope, $element, $attrs, parent) {

      $scope.$watch(function() {
        parent.getMap();
      }, function() {

        var map = parent.getMap();

        var properties = $scope.properties ? $scope.properties : [];

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
          angular.forEach(lines, function(l, i) {
            l.setOptions($scope.options(l, properties, map, i))
          });
        });

        function newData(coords) {

          angular.forEach(lines, function(l) {
            l.setMap(null);
          });

          lines = [];

          // loop through each array of array of coordinates
          angular.forEach(coords, function(l, i) {

            var opts = $scope.options ? $scope.options(l, properties, map, i) : {};
            opts.path = [];

            // loop through each array of coordinates
            angular.forEach(l, function(c) {
              opts.path.push(new google.maps.LatLng(c[0], c[1]));
            });

            opts.map = map;
            var polyline = new google.maps.Polyline(opts);

            lines.push(polyline);

            angular.forEach($scope.events, function(val, key) {
              google.maps.event.addListener(polyline, key, function(e) {
                val(e, this, map, lines);
              });
            });

          });

        };

        

      });

    }
  };
  }]);