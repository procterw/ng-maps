// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('polygon', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        coordinates: '=?', // [[p1,p2,p3],[p4,p5]]
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',     // a geojson object
        onInit: '=?',      // function()
        opacity: '=?',     // number < 100
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
          } else if ($scope.coordinates) {
            newData({
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: $scope.coordinates
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

            var feature = GeoJSON["Polygon"](data.geometry, data.properties, $scope.options, $scope.events, map);

            $scope.$watch('coordinates', function(coords) {
              if (coords) feature.setPath(coords);
            }, true);

            $scope.$watch('geojson.geometry.coordinates', function(coords) {
              if (coords) feature.setPath(coords);
            }, true);

            $scope.$watch('options', function(newOptions) {
              if (newOptions) feature.setOptions(newOptions);
            });

            $scope.$watch('properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('geojson.properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch(function() { return $scope.opacity; },
              function(opacity) {
                if (opacity && feature.setOpacity) feature.setOpacity(opacity);
              });

            $scope.$watch(function() { return $scope.visible; },
              function(visible) {
                if (typeof visible === "boolean") feature.setVisible(visible);
              });

            if ($scope.onInit) $scope.onInit(feature, data);

          };

        });

      }
    };
  }]);

