angular.module('App')
    .controller('kml', ['$scope', function($scope){
        $scope.map = {
          center: [39, -100],
          options: function() {
              return {
                zoom: 4,
                streetViewControl: false,
                scrollwheel: false
              }
          }
        };

        $scope.kml = {
          url: "http://www.epa.gov/airnow/today/airnow_conditions.kml",
          visible: true
        }
    }]);
