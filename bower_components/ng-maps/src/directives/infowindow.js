angular.module('ngMaps')
  .directive('infowindow', ['$compile', function($compile) {
    return {
      restrict: 'E',
      scope: {
        options: '=',
        position: '=',    // string, camelcase i.e. topLeft, rightBottom
        visible: '=',
        events: '='
      },
      require: '^map',
      compile: function(tElement, tAttrs) {

        return function($scope, $element, $attrs, parent) {

          $scope.$watch(function() {
            parent.getMap();
          }, function() {

            var map = parent.getMap();

            var opts = $scope.options? $scope.options() : {};

            var infowindow = new google.maps.InfoWindow(opts);

            $scope.$watch(function() {
              $element[0].style.display = "none";
              return $element[0].innerHTML + $scope.position;
            }, function(oldVal, newVal) {
              
              var pos;

              if ($scope.position.constructor === Array) {
                pos = new google.maps.LatLng($scope.position[0], $scope.position[1]);
              } else {
                pos = $scope.position;
              }

              // TODO: event handling

              var content = $element.html();
              var compiled = $compile($element.html())($scope.$parent.$parent);

              infowindow.setContent(compiled[0]);
              infowindow.setPosition(pos);
              infowindow.open(map);

            });

          });
        };
      }
    };
  }]);