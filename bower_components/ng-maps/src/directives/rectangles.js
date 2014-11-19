angular.module('ngMaps')
  .directive('rectangles', ['MapObjects', function(MapObjects) {
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

          // LOOK AT CIRCLES.JS for more
          

        });

      }
    };
}]);