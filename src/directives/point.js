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
        url: '=?',         // url to a geojson file
        visible: '=?'      // boolean
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          if (!$scope.options) $scope.options = {};
          if (!$scope.events) $scope.events = {};

          $scope.$watch(function() {
            return $scope.url;
          }, function(url) {
            if (url) newData(url);
          });

          // Get options of a given type
          function optionsOfType(type) {
            var isFunction = typeof $scope.options[type] === "function";
            return isFunction ? $scope.options[type] : function() { return {}; };
          }

          // Get events of a given type
          function eventsOfType(type) {
            var isObject = typeof $scope.events[type] === 'object';
            return isObject ? $scope.events[type] : {};
          }

          // When the dataset is loaded
          function newData(data) {

            // For each feature in the feature collection
            for (var i=0; i<data.features.length; i++) {

              var f = data.features[i];
              var type = f.geometry.type; // i.e. "Point" "MultiPolygon" etc.

              // Set options and events
              var options = optionsOfType(type);
              var events = eventsOfType(type);

              var feature = GeoJSON[type](f.geometry, f.properties, options, events, map);

              $scope.$watch(function() { return $scope.options; }, 
                function(newOptions) {
                  if (!newOptions) return;
                  feature.setOptions(optionsOfType(type));
                });

            }

          };

        });

      }
    };
  }]);





// angular.module('ngMaps')
//   .directive('point', function() {
//     restrict: 'E',
//     scope: {
//       url: '=?',         // load a geojson object
//       coordinates: "=?"      // feature OR pure geometry
//       properties: '=?'   //
//       events: '=?',      // object {event:function(), event:function()}
//       visible: '=?',     // boolean
//       options: '=?',     // function() { return {} }
//       onInit: '=?'       // function()
//     },
//     require: '^map',
//     link: function($scope, $element, $attrs, parent) {

//     }
//   });