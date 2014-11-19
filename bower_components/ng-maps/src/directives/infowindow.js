angular.module('ngMaps')
  .directive('infowindow', function() {
    return {
      restrict: 'E',
      scope: {
        position: '=',
      },
      require: '^map',
      compile: function(tElement, tAttrs) {

        return function($scope, $element, $attrs, parent) {

          $scope.$watch(function() {
            parent.getMap();
          }, function() {

            var map = parent.getMap();

            var infowindow = new google.maps.InfoWindow({
              content: null,
              position: null
            });

            $scope.$watch(function() {
              return $element[0].innerHTML + $scope.position;
            }, function(oldVal, newVal) {

              // if(oldVal != newVal) {

              infowindow.setContent($element[0].innerHTML);
              infowindow.setPosition($scope.position);
              infowindow.open(map);

              // }

            });

          });
        };
      }
    };
  });