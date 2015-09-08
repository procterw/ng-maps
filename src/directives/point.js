// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('point', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',     // a geojson object
        latitude: '=?',    // number (unique to point)
        longitude: '=?',   // number (unique to point)
        onInit: '=?',      // function()
        options: '=?',     // function() { return {} }
        properties: '=?',  // object {}
        url: '=?',         // string url to a geojson file
        visible: '=?'      // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          if (!$scope.options) $scope.options = function() { return {}; };
          if (!$scope.events) $scope.events = {};

          // Which dataset to use. Raw geojson prefered over URL
          if ($scope.geojson) {
            newData($scope.geojson);
          } else if (!isNaN($scope.latitude) && !isNaN($scope.longitude)) {
            newData({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [$scope.longitude, $scope.latitude]
              },
              properties: $scope.properties || null
            });
          } else if ($scope.url) {
            $http.get(url).then(function(success, error) {
              newData(success.data);
            });
          }

          // Accepts data in the form of geojson
          function newData(data) {

            console.log(data);

            var feature = GeoJSON.Point(data.geometry, data.properties, $scope.options, $scope.events, map);

            $scope.$watch(function() { return $scope.options; }, 
              function(newOptions) {
                if (!newOptions) return;
                feature.setOptions(newOptions);
              });

            $scope.$watch(function() { return $scope.visible; },
              function(visible) {
                if (typeof visible === "boolean") feature.setVisible(visible);
              });

            if ($scope.onInit) $scope.onInit(feature, data);


          }

        });

      }
    };
  }]);
