// TODO
// add a watch on visible
// figure out how to evaluate angular in the innerHTML

angular.module('ngMaps')
  .directive('control', function() {
    return {
      restrict: 'E',
      scope: {
        position: '@',
        visible: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          // parse position attribute i.e. "topRight" to "TOP_RIGHT"
          var position = $scope.position.split(/(?=[A-Z])/).join("_").toUpperCase();

          $scope.$watch(function() {
            return $element[0].innerHTML;
          }, function() {

            var controlDiv = document.createElement('div');

            map.controls[google.maps.ControlPosition[position]].pop();
            if ($scope.visible !== false) { controlDiv.innerHTML = $element[0].innerHTML; }
            map.controls[google.maps.ControlPosition[position]].push(controlDiv);

          });
        });
      }
    };
  });