angular.module('ng-data-map')
  .directive('polylines', ['MapObjects', function(MapObjects) {
    return {
      restrict: 'E',
      scope: {
        coords: '=',
        options: '=',
        properties: '=',
        opacity: '=',
        visible: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

        });

      }
    };
  }]);