angular.module('ngMaps')
  .directive('map', [function() {
    return {
      restrict: 'AE',
      scope: {
        center: '=',      // array [lat, lng]
        zoom: '=',        // int
        events: '=',      // object {event:function(), event:function()}
        options: '=',     // function() { return {} }
      },
      controller: function($scope) {
        // This function allows child directives to access the map
        this.getMap = function() {
          return $scope.map;
        };
      },
      transclude: true,
      link: function($scope, elem, attrs) {

        var center = $scope.center;

        var options = $scope.options? $scope.options() : {};

        var latitude = center ? center[0] : 47.6;
        var longitude = center ? center[1] : -122.3;

        options.center = new google.maps.LatLng(latitude, longitude);

        if ($scope.zoom) {
          options.zoom = $scope.zoom;
        } else if (!options.zoom) {
          options.zoom = 6; // default
        }

        $scope.$watch("center", function(center) {
          if (center) map.panTo(new google.maps.LatLng(center[0], center[1]));
        });

        // Create div for the map to be drawn in which inherits the parent classes
        var t1 = document.createElement('div');
        t1.className = attrs.class;
        elem.append(t1);

        var map = new google.maps.Map(t1, options);

        // For each event, add a listener. Also provides access to the map
        angular.forEach($scope.events, function(val, key) {
          google.maps.event.addListener(map, key, function(e) {
            val(e, map);
          });
        });

        $scope.map = map;

      }
    };
  }]);
