angular.module('ngMaps')
  .directive('geojson', ['$http', function($http) {
    return {
      restrict: 'E',
      scope: {
        url: '=',         // string  
        events: '=',      // object {event:function(), event:function()}
        visible: '=',     // boolean
        options: '=',     // function() { return {} }
        onInit: '='       // function()
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          

          $scope.$watch(function() {
            return $scope.url;
          }, function() {
            newData($scope.url);
          });

          function newData(url) {

            // AJAX request to get GeoJSON
            // The goal is to create an object that mimics a Google Map Data Layer
            $http.get(url ,{ headers: { 'Content-type': 'application/json' } })
            .success(function(data) {

              console.log(data);

              map.data.addGeoJson(data);
              map.data.setStyle($scope.options);

            });

          };

        });
      }
    };
  }]);