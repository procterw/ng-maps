angular.module('ngMaps')
  .directive('infowindow', function() {
    return {
      restrict: 'E',
      scope: {
        position: '=',    // string, camelcase i.e. topLeft, rightBottom
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

              console.log("HUH")

              // if(oldVal != newVal) {

                if ($scope.position.constructor === Array) {
                  var pos = new google.maps.LatLng($scope.position[0], $scope.position[1]);
                } else {
                  var pos = $scope.position;
                }


                infowindow.setContent($element[0].innerHTML);
                infowindow.setPosition(pos);
                infowindow.open(map);

              // }

            });

          });
        };
      }
    };
  });