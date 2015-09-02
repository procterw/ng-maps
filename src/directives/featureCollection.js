angular.module('ngMaps')
  .directive('featureCollection', ['$http', function($http) {
    return {
      restrict: 'E',
      scope: {
        data: '=',         // string  
        events: '=?',      // object {event:function(), event:function()}
        visible: '=?',     // boolean
        options: '=?',     // function() { return {} }
        onInit: '=?'       // function()
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          console.log($scope.events);
          if (!$scope.options) $scope.options = {};
          if (!$scope.events) $scope.events = {};

          $scope.$watch(function() {
            return $scope.data;
          }, function() {
            newData($scope.data);
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

              var feature = GeoJson[type](f.geometry, f.properties, options, events, map);

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

var GeoJson = (function() {

  function toLatLng(c) {
    return new google.maps.LatLng(c[1], c[0]);
  }

  //-----------------------------------------//
  //  ___  ___ ___ _  _ _____ 
  // | _ \/ _ \_ _| \| |_   _|
  // |  _/ (_) | || .` | | |  
  // |_|  \___/___|_|\_| |_|  
  //
  //-----------------------------------------//
                            

  function Point(geometry, properties, options, events, map) {

    function setOptions(options) {
      feature.setOptions(options(coords, properties, map, 0))
    };

    function setEvents(events) {
      for (var eventType in events) {
        google.maps.event.addListener(feature, eventType, function(e) {
          events[eventType](e, feature, map);
        });
      }
    }

    var coords = geometry.coordinates;
    var opts = options(coords, properties, map, 0);

    opts.position = toLatLng(coords);
    opts.map = map;

    var feature = new google.maps.Marker(opts);

    console.log(events);
    setEvents(events);

    return {
      setOptions: setOptions,
      setEvents: setEvents
    };

  }

  //-----------------------------------------//
  //  _    ___ _  _ ___ ___ _____ ___ ___ _  _  ___ 
  // | |  |_ _| \| | __/ __|_   _| _ \_ _| \| |/ __|
  // | |__ | || .` | _|\__ \ | | |   /| || .` | (_ |
  // |____|___|_|\_|___|___/ |_| |_|_\___|_|\_|\___|
  //                                              
  //-----------------------------------------//


  function LineString(geometry, properties, options, events, map) {

    function setOptions(options) {
      feature.setOptions(options(coords, properties, map, 0))
    }

    function setEvents(events) {
      
    }

    var coords = geometry.coordinates;
    var opts = options(coords, properties, map, 0);

    opts.path = coords.map(toLatLng);
    opts.map = map;

    var feature = new google.maps.Polyline(opts);

    return {
      setOptions: setOptions,
      setEvents: setEvents
    }

  }

  //-----------------------------------------//
  //  ___  ___  _ __   _____  ___  _  _ 
  // | _ \/ _ \| |\ \ / / __|/ _ \| \| |
  // |  _/ (_) | |_\ V / (_ | (_) | .` |
  // |_|  \___/|____|_| \___|\___/|_|\_|
  //
  //-----------------------------------------//


  function Polygon(geometry, properties, options, events, map) {

    // Public option setter
    function setOptions(options) {
      feature.setOptions(options(coords, properties, map, 0))
    }

    function setEvents(events) {

    }

    // Coordinates and options
    var coords = geometry.coordinates;
    var opts = options(coords, properties, map, 0);

    // Format points in google maps LatLng class
    opts.paths = coords.map(function(c) {
      return c.map(toLatLng);
    });
    opts.map = map;

    // Map feature
    var feature = new google.maps.Polygon(opts);

    return {
      setOptions: setOptions,
      setEvents: setEvents
    }

  }

  return {
    Point: Point,
    LineString: LineString,
    Polygon: Polygon
  }

  // MultiPoint: null,
  // MultiLineString: null,
  // MultiPolygon: null
})()

angular.module('ngMaps')
  .directive('point', function() {
    restrict: 'E',
    scope: {
      coordinates: '=',
      events: '=?',      // object {event:function(), event:function()}
      visible: '=?',     // boolean
      options: '=?',     // function() { return {} }
      onInit: '=?'       // function()
    },
    require: '^map',
    link: function($scope, $element, $attrs, parent) {

    }
  });