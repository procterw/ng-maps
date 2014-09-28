angular.module('ng-data-map', [])



    .factory('MapObjects', function() {

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

        API.map;

        API.markers = {};

        API.groundOverlay;

        return API;

    })



    .directive('map', function (MapObjects) {
      return {
      	restrict: 'AE',
        scope: {
            zoom: '=',
            center: '=',
            events: '='
        },
        controller: function($scope) {
            this.getMap = function() {
               return $scope.map;
            }
        },
        transclude: true,
      	link: function ($scope, elem, attrs) {

	        var mapOptions,
	          center = $scope.center,
	          zoom = $scope.zoom,
              events = $scope.events,
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
                    val(e, MapObjects)
                })
            });

	        $scope.map = map;

	      }
	  }
    })



    .directive('marker', function (MapObjects) {
    	return {
    		restrict: 'E',
    		scope: {
    			options: '&',
    			events: '&',
                position: '='
    		},
    		require:'^map',
    		link: function ($scope, $element, $attrs, parent) {

    			$scope.$watch(function(){ parent.getMap() }, function(){

                    var map = parent.getMap()

    				var events = $scope.events();
    				var options = $scope.options();
                    var position = $scope.position;
                    var idkey = $attrs.idkey ? $attrs.idkey : false;

                    options.position = new google.maps.LatLng(position[0], position[1]);
                    options.map = map;

    				var marker = new google.maps.Marker(options);

    				// For each event, add a listener. Also provides access to the map and parent scope
    				angular.forEach(events, function(val, key) {
    					google.maps.event.addListener(marker, key, function(e){
                            val(e, MapObjects);
                        });
    				});

                    // Create the "active" marker, which the parent scope can access and do what it wants with
                    if(idkey) {
                       MapObjects.markers[idkey] = marker;
                    }

                    // Watch for changes in position and move marker when they happen
                    $scope.$watch(function(){
                        return $scope.position;
                    }, function() {
                        var position = $scope.position;
                        marker.setPosition(new google.maps.LatLng(position[0], position[1]));
                    });

                    // When the marker is dragged, update the scope with its new position
                    google.maps.event.addListener(marker, "drag", function(){
                        $scope.$apply(function(){
                            $scope.position = [marker.getPosition().lat(), marker.getPosition().lng()]
                        });
                    });

    			});
    		}
    	}	
    })


    .directive('geopoints', function (MapObjects, $http) {
        return {
            restrict: 'E',
            scope: {
                url: '=',
                style: '=',
                events: '=',
                options: '=',
                visible: '='
            },
            require:'^map',
            link: function ($scope, $element, $attrs, parent) {

                $scope.$watch(function(){ parent.getMap() }, function(){

                    var map = parent.getMap()

                    var url = $scope.url;
                    var style = $scope.style;
                    var options = $scope.options ? $scope.options : {};

                    var markers = [];

                    // Sets a given markers style
                    // Looks at each potential property and changes it if it exists
                    var setStyle = function(marker, style) {

                        if (style.icon) {
                            marker.setIcon(style.icon)
                        } else {
                            marker.setIcon(null)
                        }

                        marker.setVisible(style.visible)

                    }

                    // If the style changes restyle each element
                    $scope.$watch(function(){ return $scope.style }, function() {
                        angular.forEach(markers, function(marker) {
                            setStyle(marker, $scope.style(marker, MapObjects));
                        })
                    });

                    $scope.$watch(function(){ return $scope.visible }, function(){
                        angular.forEach(markers, function(marker) {
                            marker.setVisible($scope.visible);
                        })
                    })

                    $http.get(url).success(function(data) {

                        angular.forEach(data.features, function(m, i) {
                            options.map = map;
                            options.position = new google.maps.LatLng(m.geometry.coordinates[1], m.geometry.coordinates[0]);

                            var marker = new google.maps.Marker(options);

                            // Assign properties to marker
                            marker.properties = m.properties;

                            // Assign geometry to marker
                            marker.geometry = m.geometry;

                            // Helper function so multimarkers' API matches data layer
                            marker.getProperty = function(p) {
                                return this.properties[p];
                            }

                            setStyle(marker, style(marker, MapObjects));
                        
                            markers.push(marker)

                            // For each event, add a listener. Also provides access to the map and parent scope
                            angular.forEach($scope.events, function(val, key) {
                                google.maps.event.addListener(marker, key, function(e){
                                    val(e, marker, MapObjects);
                                });
                            });
                           

                        })


                    
                    });

                });
            }
        }   
    })




   .directive('geopolygons', function (MapObjects, $http) {
        return {
            restrict: 'E',
            scope: {
                url: '=',
                events: '=',
                options: '=',
                visible: '='
            },
            require:'^map',
            link: function ($scope, $element, $attrs, parent) {

                $scope.$watch(function(){ parent.getMap() }, function(){

                    var map = parent.getMap()

                    var url = $scope.url;

                    var polygons = [];
                    // var style = $scope.style;
                    // var options = $scope.options ? $scope.options : {};

                    // var markers = [];

                    // // Sets a given markers style
                    // // Looks at each potential property and changes it if it exists
                    // var setOptions = function(marker, options) {

                    //     marker.setO

                    // }

                    // // If the style changes restyle each element
                    // $scope.$watch(function(){ return $scope.style }, function() {
                    //     angular.forEach(markers, function(marker) {
                    //         setStyle(marker, $scope.style(marker, MapObjects));
                    //     })
                    // });

                    // $scope.$watch(function(){ return $scope.visible }, function(){
                    //     angular.forEach(markers, function(marker) {
                    //         marker.setVisible($scope.visible);
                    //     })
                    // })

                    $http.get(url).success(function(data) {

                        angular.forEach(data.features, function(p, i) {

                            // Express each coordinate pair as a google maps object
                            for (var i=0; i < p.geometry.coordinates.length; i++) {
                                var coords = p.geometry.coordinates[i];
                                for (var i=0; i < coords.length; i++) {
                                    coords[i] = new google.maps.LatLng(coords[i][1], coords[i][0])
                                }
                            }

                            polygon = new google.maps.Polygon({
                                paths: p.geometry.coordinates
                            });

                            polygon.setOptions($scope.options)

                            polygon.setMap(map)
                       
                            // Assign properties to marker
                            polygon.properties = p.properties;

                            // Assign geometry to marker
                            polygon.geometry = p.geometry;

                            // Helper function so multimarkers' API matches data layer
                            polygon.getProperty = function(p) {
                                return this.properties[p];
                            }
                        
                            polygons.push(polygon)

                            // For each event, add a listener. Also provides access to the map and parent scope
                            // For some reason, the val function requires "this" instead of "polygon"
                            angular.forEach($scope.events, function(val, key) {
                                google.maps.event.addListener(polygon, key, function(e){
                                    val(e, this, MapObjects);
                                });
                            });
                           

                        })


                    
                    });

                });
            }
        }   
    })


 

    // .directive('geojson', function (MapObjects) {
    // 	return {
    // 		restrict: 'E',
    // 		scope: { 
    // 			url: '&',
    // 			style: '&',
    // 			events: '&'
    // 		},
    // 		require:'^map',
    // 		link: function ($scope, $element, $attrs, parent) {

    //             $scope.$watch(function(){ parent.getMap() }, function(){

    //                 var map = parent.getMap()

    // 				var url = $scope.url();
	   //  			var style = $scope.style();
	   //  			var events = $scope.events();

    // 				map.data.loadGeoJson(url);
    // 				map.data.setStyle(style);

    // 				// For each event, add a listener. Also provides access to the map and parent scope
    // 				angular.forEach(events, function(val, key) {
    // 					map.data.addListener(key, val, function(e){
    //                         val(e, MapObjects)
    //                     })
    // 				});

    // 			});

    //         }
    // 	}	

    // })



    .directive('overlay', function (MapObjects) {

        return {
            restrict: 'E',
            scope: { 
                url: '=',
                opacity: '=',
                bounds: '=',
                visible: '='
            },
            require:'^map',
            link: function ($scope, $element, $attrs, parent) {

                $scope.$watch(function(){ parent.getMap() }, function(){

                    var map = parent.getMap()

                    var deleteOverlay = function() {
                        if (overlay) {
                            overlay.setMap(null);
                            overlay = null;
                        }
                    }

                    var newOverlay = function() {
                        deleteOverlay();
                        var overlay = new google.maps.GroundOverlay($scope.url, $scope.bounds)
                        overlay.setOpacity($scope.opacity)
                        if ($scope.visible) {
                            overlay.setMap(map)
                        } else {
                            overlay.setMap(null)
                        }
                        return overlay
                    }

                    var overlay = newOverlay();

                    $scope.$watch('url + bounds', function(){
                        overlay = newOverlay();
                    })

                    $scope.$watch('opacity', function(){
                        overlay.setOpacity($scope.opacity)
                    })

                    $scope.$watch('visible', function(){
                        if($scope.visible) {
                            overlay.setMap(map);
                        } else {
                            overlay.setMap(null);
                        }
                    })

                });

            }

        };

    })

    

    .directive('infowindow', function (MapObjects) {
        return {
            restrict: 'E',
            scope: {
                position: '=',
                title: "=",
                variables: '=',
                values: "="
            },
            require:'^map',
            link: function ($scope, $element, $attrs, parent) {

                $scope.$watch(function(){ parent.getMap() }, function(){

                    var makeContent = function() {
                        var htmlString = "";
                        if($scope.title) {
                            htmlString += "<b>" + $scope.title + "</b><br>";
                        }
                        if($scope.variables && $scope.values) {
                            for (var i = 0; i < $scope.variables.length; i++) {
                                htmlString += "<small><b>" + $scope.variables[i] + ":</b> " + $scope.values[i] + "</small><br>";
                            };
                        }
                        return htmlString;
                    }


                    $scope.$watch('[position, title, variables, values]', function(){
                        if ($scope.position) {
                            infowindow.setContent(makeContent());
                            infowindow.setPosition($scope.position);
                            infowindow.open(map);
                        }
                    }, true)

                    var map = parent.getMap()

                    var infowindow = new google.maps.InfoWindow({
                        content: null,
                        position: new google.maps.LatLng(47.6, -122.3)
                    });

                    

                });
            }
        }
    })




