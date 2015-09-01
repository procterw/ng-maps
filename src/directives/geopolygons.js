angular.module('ngMaps')
  .directive('geopolygons', ['$http', 'MultiPolygonService', function($http, MultiPolygon) {
    return {
      restrict: 'E',
      scope: {
        url: '=',     // string
        events: '=',  // object {event:function(), event:function()}
        options: '=', // function() { return {} }
        visible: '=', // boolean
        opacity: '=', // int 0 -> 100
        onInit: '='   // function()
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          // Get the map
          var map = parent.getMap();

          // Array of all polygons
          var polygons = [];

          // Watch options
          $scope.$watch('options', function() {
            angular.forEach(polygons, function(p, i) {
              var opts = $scope.options ? $scope.options(p.geometry, p.properties, map, i) : {};
              opts.fillOpacity = $scope.opacity ? $scope.opacity/100 : 1;
              p.setOptions(opts);
            });
          });

          // Watch opacity
          $scope.$watch('opacity', function() {
            if($scope.opacity) {
              angular.forEach(polygons, function(p) {
                p.setOptions({fillOpacity: $scope.opacity / 100});
              });
            }
          });

          $scope.$watch('visible', function() {
            angular.forEach(polygons, function(p) {
              p.setVisible($scope.visible);
            });
          });

          // When the URL changes, make new polygons
          $scope.$watch('url', function() {
            newData($scope.url);
          });

          function newData(url) {

            // Fetch the data
            $http.get(url ,{ headers: { 'Content-type': 'application/json' } })
            .success(function(data) {

              // Remove each existing polygon from the map
              angular.forEach(polygons, function(p) {
                p.setMap(null);
              });
              
              // Reset polygon array
              polygons = [];

              // For each poly OR multipoly, 
              angular.forEach(data.features, function(p, i) {

                  // var PC = new PolygonCollection(p, i);

                  var MP = new MultiPolygon(p, i, map, $scope.options, $scope.opacity);

                  polygons.push(MP);

                  angular.forEach(MP.polygons, function(polygon) {
                    angular.forEach($scope.events, function(val, key) {
                      google.maps.event.addListener(polygon, key, function(e) {
                        val(e, MP, map, polygons);
                      });
                    });
                  })
                  
              });

              // Fire onInit function now that data is loaded
              if ($scope.onInit) $scope.onInit(polygons, data);

            });

          };

          

        });
      }
    };
  }]);