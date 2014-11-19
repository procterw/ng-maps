angular.module('ngMaps')
  .directive('circles', ['MapObjects', function(MapObjects) {
  return {
      restrict: 'E',
      scope: {
        geometries: '=',
        events: '=',
        visible: '=',
        options: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Set map
          var map = parent.getMap();

          // List of circles
          var circleList = [];

          // Watch for changes in visibility
          $scope.$watch('visible', function() {
            angular.forEach(circleList, function(c) {
              c.setVisible($scope.visible)
            })
          })

          // Watch for changes in options
          $scope.$watch('options', function() {
            angular.forEach(circleList, function(c) {
              c.setOptions(options)
            })
          })

          // Watch for changes in data
          $scope.$watch('geometries', function() {
            newData();
          })

          // Make a new collection of circles
          newData = function() {

            // Remove each object from map
            angular.forEach(circleList, function(c){
              c.setMap(null);
            })

            // Delete objects
            circleList = [];

            // Create new objects
            angular.forEach($scope.geometries, function(c) {
              var opts = $scope.options ? $scope.options : {};
              opts.center = new google.maps.LatLng(c.center[0], c.center[1]);
              opts.radius = c.radius;
              opts.map = map;

              var circle = new google.maps.Circle(opts);
              circleList.push(circle)

              angular.forEach($scope.events, function(val, key) {
                google.maps.event.addListener(circle, key, function(e) {
                  val(e, this, MapObjects);
                });
              });


            })
          }

          

          

        });

      }
    };
}])