angular.module('App')
	.controller('geopolygons', ['$scope', function($scope){

	$scope.map = {
      center: [40, -100],
      options: {
      	streetViewControl: false,
      	scrollwheel: false
      },
      zoom: 4
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
      mouseover: function(e, p) {
        p.setOptions({
          strokeWeight: 2,
          zindex: 100
        })
      },
      mouseout: function(e, p) {
        p.setOptions({
          strokeWeight: 1,
          zindex: 0
        })
      }
    }
	}

	}]);