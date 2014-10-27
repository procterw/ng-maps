angular.module('ng-data-map')
  .directive('map', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'AE',
      scope: {
        center: '=',
        events: '=',
        options: '='
      },
      controller: function($scope) {
        // This function allows child directives to access the map
        this.getMap = function() {
          return $scope.map;
        };
      },
      transclude: true,
      link: function($scope, elem, attrs) {

        var events = $scope.events;
        var center = $scope.center;
        var map;

        var options = $scope.options ? $scope.options : {};

        var latitude = center ? center[0] : 47.6;
        var longitude = center ? center[1] : -122.3;

        options.center = new google.maps.LatLng(latitude, longitude);
        options.zoom = options.zoom ? options.zoom : 8;

        map = new google.maps.Map(elem[0], options);

        // For each event, add a listener. Also provides access to the map
        angular.forEach(events, function(val, key) {
          google.maps.event.addListener(map, key, function(e) {
            val(e, MapObjects);
          });
        });

        $scope.map = map;

      }
    };
  }]);
