// FeatureCollection assumes a valid GeoJson featureCollection object.
angular.module('ngMaps')
  .directive('featureCollection', ['$http', 'GeoJSONService', function($http, GeoJSON) {
    return {
      restrict: 'E',
      scope: {
        events: '=?',      // object {event:function(), event:function()}
        geojson: '=?',      // a geojson object
        onInit: '=?',      // function()
        opacity: '=?',     // function()
        options: '=?',     // function() { return {} }
        url: '=?',         // url to a geojson file
        visible: '=?'     // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          // Defaut values for options and events
          if (!$scope.options) $scope.options = {};
          if (!$scope.events) $scope.events = {};

          // Which dataset to use. Raw geojson prefered over URL
          if ($scope.geojson) {
            newData($scope.geojson);
          } else if ($scope.url) {
            $http.get(url).then(function(success, error) {
              newData(success.data);
            });
          }

          // Get options of a given type
          function optionsOfType(type, options) {
            var isFunction = typeof options[type] === "function";
            return isFunction ? options[type] : function() { return {}; };
          }

          // Get events of a given type
          function eventsOfType(type, events) {
            var isObject = typeof events[type] === 'object';
            return isObject ? events[type] : {};
          }

          // Accepts data in the form of geojson
          function newData(data) {

            var features = [];

            function newFeature(f){

              var type = f.geometry.type; // i.e. "Point" "MultiPolygon" etc.

              // Set options and events
              var options = optionsOfType(type, $scope.options);
              var events = eventsOfType(type, $scope.events);

              var feature = GeoJSON[type](f.geometry, f.properties, options, events, map);

              features.push(feature.getMapFeature());

              $scope.$watch('options', function(newOptions) {
                if (!newOptions) return;
                feature.setOptions(optionsOfType(type, newOptions));
              });

              $scope.$watch('opacity', function(opacity) {
                if (opacity && feature.setOpacity) feature.setOpacity(opacity);
              });

              $scope.$watch('visible', function(visible) {
                if (typeof visible === "boolean") feature.setVisible(visible);
              });

            }

            // For each feature in the feature collection
            for (var i=0; i<data.features.length; i++) {

              newFeature(data.features[i]);

            }

            if ($scope.onInit) $scope.onInit(features, data);

          }

        });

      }
    };
  }]);
