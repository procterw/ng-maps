angular.module('ng-data-map', [])



	.controller('Main', ['$scope', 'MapUtils', function($scope, Utils) {
        $scope.closest = Utils.closest
	}])



    .directive('map', function () {
      return {
      	restrict: 'AE',
        controller: 'Main',
      	link: function ($scope, elem, attrs) {

	        var mapOptions,
	          center = $scope.$eval(attrs.center),
	          zoom = $scope.$eval(attrs.zoom),
              events = $scope.$eval(attrs.events),
	          map;

	        latitude = center && center[0] || 47.6;
	        longitude = center && center[1] || -122.3;
	        zoom = zoom && zoom || 8;

	        mapOptions = {
	          zoom: zoom,
	          center: new google.maps.LatLng(latitude, longitude)
	        };

	        map = new google.maps.Map(elem[0], mapOptions);

            // For each event, add a listener. Also provides access to the map
            angular.forEach(events, function(val, key) {
                google.maps.event.addListener(map, key, function(e){
                    val(e, map, $scope)
                })
            });

	        $scope.map = map;

	      }
	  }
    })



    .directive('marker', function () {
    	return {
    		restrict: 'E',
    		scope: {
    			options: '&',
    			events: '&'
    		},
    		require:'^map',
    		controller: function ($scope, $element, $attrs) {

    			$scope.$watch(function(){$scope.$parent.map}, function(){

    				var map = $scope.$parent.map;

    				var events = $scope.events();
    				var options = $scope.options();
                    var clickmove = $attrs.clickmove ? $attrs.clickmove : false;

                    options.position = new google.maps.LatLng(options.position[0], options.position[1]);
                    options.map = map;

    				var marker = new google.maps.Marker(options);

    				// For each event, add a listener. Also provides access to the map and parent scope
    				angular.forEach(events, function(val, key) {
    					google.maps.event.addListener(marker, key, function(e){
                            val(e, map, $scope.$parent);
                        });
    				});

                    // Create the "active" marker, which the parent scope can access and do what it wants with
                    if(clickmove) {
                        $scope.$parent.activeMarker = marker;
                    }
    				
    			});
    		}
    	}	
    })



    .directive('geojson', function () {
    	return {
    		restrict: 'E',
    		scope: { 
    			url: '&',
    			style: '&',
    			events: '&'
    		},
    		require:'^map',
    		controller: function ($scope, $element,$attrs) {

    			// Wait until map is initialized
    			$scope.$watch(function(){$scope.$parent.map}, function(){

    				var map = $scope.$parent.map;
    				var url = $scope.url();
	    			var style = $scope.style();
	    			var events = $scope.events();

    				map.data.loadGeoJson(url);
    				map.data.setStyle(style);

    				// For each event, add a listener. Also provides access to the map and parent scope
    				angular.forEach(events, function(val, key) {
    					map.data.addListener(key, val, function(e){
                            val(e, map, $scope.$parent)
                        })
    				});

    			});
            }
    	}	

    })



    .directive('groundOverlay', function () {

    })



    .factory('MapUtils', function () {

        var API = {};

        // Find closest point to coordinates in a feature collection
        // Currently just used for point data layers
        API.closest = function(coords1, data) {
          var closest;
          var dist = 1000000000;
          angular.forEach(data, function(feature){
            var coords2 = feature.getGeometry().get()
            var distance = google.maps.geometry.spherical.computeDistanceBetween(coords1, coords2)
            if(!closest || closest.distance > distance){
              closest = {marker:feature, distance: distance}
            }
          });
          return closest.marker
        }

        return API;

    })