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
    options: function() {
      return {
        fillColor: 'orange',
        strokeWeight: 1,
        strokeColor: 'white'
      }
    },
    events: {
      mouseover: function() {
        p.setOptions({
          strokeWeight: 4,
          zindex: 100
        })
      },
      mouseout: function() {
        p.setOptions({
          strokeWeight: 1,
          zindex: 0
        })
      }
    }
	}

	}]);