angular.module('App')
  .controller('geopoints', ['$scope', function($scope){

  $scope.map = {
      center: [39, -121],
      options: function() {
          return {
            streetViewControl: false,
            scrollwheel: false
          }
      }
    };

  $scope.stations = {
    url: "data/AirNow_Sites_PM2.5.geojson",
    options: function(geometry, properties, map, i) {
      var draggable = i%2 === 0;
      return {
        draggable: draggable
      };
    },
    events: {
      click: function(e, marker, map, markers) {
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        var name = marker.getProperty("siteName");
        alert(lat + " " + lng + " " + name);
      }
    },
    onInit: function(markers) {
      console.log(markers);
    }
  }

  }]);