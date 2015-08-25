angular.module('App')
	.controller('geopolygons', ['$scope', function($scope){

	$scope.map = {
      center: [40, -100],
      options: function() {
          return {
            zoom: 4,
            streetViewControl: false,
            scrollwheel: false
          }
      }
    };

	$scope.states = {
		url: "data/states.geojson",
    options: function(geometry, properties, map, i) {
      return {
        fillColor: '#4DAF7C',
        strokeWeight: 1,
        strokeColor: '#43896E'
      }
    },
    events: {
      mouseover: function(e, p, map, polygons) {
        p.setOptions({
          strokeWeight: 4,
          zIndex: 900
        })
      },
      mouseout: function(e, p, map, polygons) {
        p.setOptions({
          strokeWeight: 1,
          zIndex: 0
        })
      },
      click: function(e, p, map, polygons) {
        var opacity = Math.random();
        p.setOptions({
          fillOpacity: opacity
        })
      }
    },
    onInit: function(polygons) {
      console.log(polygons);
    }
	}

	}]);