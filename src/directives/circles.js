angular.module('ng-data-map')
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

          var map = parent.getMap();

          var circleList = [];

          $scope.$watch('visible', function() {
            angular.forEach(circleList, function(c) {
              c.setVisible($scope.visible)
            })
          })

          newData = function() {

            angular.forEach(circleList, function(c){
              c.setMap(null);
            })

            circleList = [];

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

          $scope.$watch('geometries', function() {
            newData()
          })

          

        });

      }
    };
})