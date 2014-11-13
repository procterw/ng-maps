angular.module('ngMaps')
  .directive('control', function() {
    return {
      restrict: 'E',
      scope: {
        position: '@'
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
            controlDiv.innerHTML = $element[0].innerHTML;
            map.controls[google.maps.ControlPosition[position]].push(controlDiv);

          });


        });


      }
    };
  });