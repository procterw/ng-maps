// TODO
// add a watch on visible
// figure out how to evaluate angular in the innerHTML

// http://stackoverflow.com/questions/18776818/angularjs-ng-click-inside-of-google-maps-infowindow

angular.module('ngMaps')
  .directive('control', ['$compile', function($compile) {
    return {
      restrict: 'E',
      scope: {
        position: '@',  // string, camelcase i.e. topLeft, rightBottom
        visible: '='    // boolean
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
            $element[0].style.display = "none"; // important: without this the HTML content won't display
            return $element[0].innerHTML;
          }, function() {

            var content = $element.html();
            var compiled = $compile($element.html())($scope.$parent.$parent);

            var controlDiv = document.createElement('div');

            var controlList = map.controls[google.maps.ControlPosition[position]];

            if (controlList.length > 0) map.controls[google.maps.ControlPosition[position]].pop();
            if ($scope.visible !== false) { controlDiv.innerHTML = content }
            map.controls[google.maps.ControlPosition[position]].push(compiled[0]);

          });

        });
      }
    };
  }]);