angular.module('ngMaps')
  .factory('MapObjects', function() {

    var API = {};

    // Find closest point to coordinates in a feature collection
    // Currently just used for point data layers
    API.closest = function(coords1, data) {
      var closest;
      var dist = 1000000000;
      angular.forEach(data, function(feature) {
        var coords2 = feature.getGeometry().get();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(coords1, coords2);
        if (!closest || closest.distance > distance) {
          closest = {
            marker: feature,
            distance: distance
          };
        }
      });
      return closest.marker;
    };

    API.map = null;

    return API;

  });