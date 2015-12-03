// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('point', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        decimals: '=?',    // how many decimals to round to when dragged
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',     // a geojson object
        latitude: '=?',    // number (unique to point)
        longitude: '=?',   // number (unique to point)
        onInit: '=?',      // function()
        onMove: '=?',
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

          function round(n) {
            if (!isNaN($scope.decimals)) {
              return Math.round(Math.pow(10, $scope.decimals) * n) / Math.pow(10, $scope.decimals);
            } else {
              return n;
            }
          }

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

            var feature = GeoJSON.Point(data.geometry, data.properties, $scope.options, $scope.events, map);

            $scope.$watch('[longitude, latitude]', function(coords) {
              if (coords) feature.setPosition(coords);
            }, true);

            $scope.$watch('geojson.geometry.coordinates', function(coords) {
              if (coords) feature.setPosition(coords);
            }, true);

            $scope.$watch('properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('geojson.properties', function(properties) {
              if (properties) feature.setProperties(properties);
            });

            $scope.$watch('options', function(newOptions) {
              if (newOptions) feature.setOptions(newOptions);
            });

            $scope.$watch('visible', function(visible) {
              if (typeof visible === "boolean") feature.setVisible(visible);
            });

            if ($scope.onInit) $scope.onInit(feature, data);

            google.maps.event.addListener(feature.getMapFeature(), "drag", function() {
              $scope.$apply(function() {
                var lat = round(feature.getMapFeature().getPosition().lat());
                var lng = round(feature.getMapFeature().getPosition().lng());
                if ($scope.geojson) {
                  $scope.geojson.geometry.coordinates = [lng, lat];
                } else if (!isNaN($scope.latitude) && !isNaN($scope.longitude)) {
                  $scope.latitude = lat;
                  $scope.longitude = lng;
                }
              });
            });

          }

        });

      }
    };
  }]);
