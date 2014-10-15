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
                options: '=',
                events: '=',
                position: '=',
                lat: '=',
                lng: '='
            },
            require:'^map',
            link: function ($scope, $element, $attrs, parent) {

                $scope.$watch(function(){ parent.getMap() }, function(){

                    var map = parent.getMap()

                    var events = $scope.events ? $scope.events: {};
                    var options = $scope.options ? $scope.options : {};

                    var curPosition = function() {
                        if ($scope.position) {
                            return new google.maps.LatLng($scope.position[0], $scope.position[1]);
                        } else if ($scope.lat && $scope.lng) {
                            return new google.maps.LatLng($scope.lat, $scope.lng);
                        }
                    }

                    options.position = curPosition();
                    options.map = map;

                    var marker = new google.maps.Marker(options);

                    // For each event, add a listener. Also provides access to the map and parent scope
                    angular.forEach(events, function(val, key) {
                        google.maps.event.addListener(marker, key, function(e){
                            val(e, MapObjects);
                        });
                    });

                    // Watch for changes in position and move marker when they happen
                    $scope.$watch('[position, lat, lng]', function() {
                        marker.setPosition(curPosition());
                    }, true);

                    // When the marker is dragged, update the scope with its new position
                    google.maps.event.addListener(marker, "drag", function(){
                        $scope.$apply(function(){
                            var lat = marker.getPosition().lat();
                            var lng = marker.getPosition().lng();
                            if ($scope.position) {
                                $scope.position = [lat, lng];
                            } else if ($scope.lat && $scope.lng) {
                                $scope.lat = lat;
                                $scope.lng = lng;
                            }
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
                visible: '=',
                zindex: '='
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

                        if (style.opacity) { marker.setOpacity(style.opacity) }
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
                            options.zIndex = $scope.zindex(m)

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
                                    val(e, marker, MapObjects, markers);
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
    //  return {
    //      restrict: 'E',
    //      scope: { 
    //          url: '&',
    //          style: '&',
    //          events: '&'
    //      },
    //      require:'^map',
    //      link: function ($scope, $element, $attrs, parent) {

    //             $scope.$watch(function(){ parent.getMap() }, function(){

    //                 var map = parent.getMap()

    //              var url = $scope.url();
       //           var style = $scope.style();
       //           var events = $scope.events();

    //              map.data.loadGeoJson(url);
    //              map.data.setStyle(style);

    //              // For each event, add a listener. Also provides access to the map and parent scope
    //              angular.forEach(events, function(val, key) {
    //                  map.data.addListener(key, val, function(e){
    //                         val(e, MapObjects)
    //                     })
    //              });

    //          });

    //         }
    //  }   

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

                    function isFloat(n) {
                        return n === +n && n !== (n|0);
                    }

                    var parseOpacity = function() {
                        if (isFloat($scope.opacity)) {
                            return $scope.opacity
                        } else {
                            return parseFloat($scope.opacity)
                        }
                    }

                    var deleteOverlay = function() {
                        if (overlay) {
                            overlay.setMap(null);
                            overlay = null;
                        }
                    }

                    var newOverlay = function() {
                        deleteOverlay();
                        var overlay = new google.maps.GroundOverlay($scope.url, $scope.bounds, {clickable: false})
                        overlay.setOpacity(parseOpacity() / 100)
                        if ($scope.visible !== false) {
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
                        overlay.setOpacity(parseOpacity() / 100)
                    })

                    $scope.$watch('visible', function(){
                        if($scope.visible !== false) {
                            overlay.setMap(map);
                        } else {
                            overlay.setMap(null);
                        }
                    })

                });

            }

        };

    })

    

    .directive('infowindow', function () {
        return {
            restrict: 'E',
            scope: {
                position: '=',
            },
            require:'^map',
            compile: function(tElement, tAttrs) {
                
                return function ($scope, $element, $attrs, parent) {

                    $scope.$watch(function(){ parent.getMap() }, function(){

                        var map = parent.getMap()

                        $scope.$watch(function() {
                            return $element[0].innerHTML + $scope.position
                        }, function(oldVal, newVal) {

                            // if(oldVal != newVal) {

                                infowindow.setContent($element[0].innerHTML)
                                infowindow.setPosition($scope.position)
                                infowindow.open(map)

                            // }

                        })

                        var infowindow = new google.maps.InfoWindow({
                            content: null,
                            position: null
                        });

                    });
                }
            }
        }
    })



    .directive('control', function() {
        return {
            restrict: 'E',
            scope: {
                position: '@'
            },
            require:'^map',
            link: function ($scope, $element, $attrs, parent) {

                $scope.$watch(function(){ parent.getMap() }, function(){

                    var map = parent.getMap()

                    // parrse position attribute
                    var position = $scope.position.split(/(?=[A-Z])/).join("_").toUpperCase()

                    $scope.$watch(function(){
                        return $element[0].innerHTML
                    }, function() {

                        var controlDiv = document.createElement('div')

                        map.controls[google.maps.ControlPosition[position]].pop();
                        controlDiv.innerHTML = $element[0].innerHTML
                        map.controls[google.maps.ControlPosition[position]].push(controlDiv);

                    })
                    

                });

                
            }
        }
    })




