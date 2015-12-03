angular.module("ngMaps")
	.factory("MultiPolygonService", function() {

		// Takes a polygon or multipolygon and adds additional funtionality
    return function(p, i, map, options, opacity) {

      this.type = p.geometry.type;
      this.properties = p.properties;

      this.setOptions = function(o) {
        angular.forEach(polygons, function(p) {
          p.setOptions(o);
        });
      };

      this.setVisible = function(o) {
        angular.forEach(polygons, function(p) {
          p.setVisible(o);
        });
      };

      this.getMap = function(o) {
        angular.forEach(polygons, function(p) {
          p.getMap(o);
        });
      };

      // All of the polygon objects in this collection
      var polygons = [];

      var opts = options ? options(p.geometry, p.properties, i, map) : {};
      opts.fillOpacity = opacity ? opacity/100 : 1;

      if (this.type === "MultiPolygon") {

        angular.forEach(p.geometry.coordinates, function(c) {
          angular.forEach(c, function(c2) {
            // Each c2 is a single polygon
            var coords = [];
            // Create google map latlngs
            angular.forEach(c2, function(c3) {
              coords.push(new google.maps.LatLng(c3[1], c3[0]))
            });
            // New polygon
            var polygon = new google.maps.Polygon({
              paths: coords
            });
            // Set options and map
            polygon.setOptions(opts);
            polygon.setMap(map);
            // Add to polygon array
            polygons.push(polygon);
          });
        });

      } else { // Normal polygon

        var coords = [];
        angular.forEach(p.geometry.coordinates, function(c) {
          // Create google map latlngs
          angular.forEach(c, function(c2) {
            coords.push(new google.maps.LatLng(c2[1], c2[0]))
          });
        });
        // New polygon
        var polygon = new google.maps.Polygon({
          paths: coords
        });
        // Set options and map
        polygon.setOptions(opts);
        polygon.setMap(map);
        // Add to polygon array
        polygons.push(polygon);

      }

      this.polygons = polygons;

    };

	});