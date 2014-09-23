angular.module('googleDataMap', [])

	.controller('Main', ['$scope', function($scope) {

	}])

    .directive('map', function () {
      return {
    	
      	restrict: 'AE',
      	link: function ($scope, elem, attrs) {

	        var mapOptions,
	          latitude = attrs.latitude,
	          longitude = attrs.longitude,
	          zoom = attrs.zoom,
	          map;

	        latitude = latitude && parseFloat(latitude, 10) || 43.074688;
	        longitude = longitude && parseFloat(longitude, 10) || -89.384294;
	        zoom = zoom && parseFloat(zoom, 8) || 8;

	        mapOptions = {
	          zoom: 8,
	          center: new google.maps.LatLng(latitude, longitude)
	        };

	        map = new google.maps.Map(elem[0], mapOptions);

	        $scope.map = map;

	      }
	  }


    })

    // .directive('marker', function () {

    // 	return {
    // 		restrict: 'E',
    // 		scope: {
    // 			position: '&',
    // 			icon: '&',
    // 			options: '&',
    // 			events: '&'
    // 		},
    // 		require:'^map',
    // 		controller: function ($scope) {

    // 			$scope.$watch(function(){$scope.$parent.map}, function(){

    // 				var map = $scope.$parent.map;

    // 				var position= new google.maps.LatLng($scope.position()[0], $scope.position()[1]);
    // 				var icon = $scope.icon();
    // 				var events = $scope.events();
    // 				var options = $scope.options()
    // 				var marker = new google.maps.Marker({
    // 					position: position,
    // 					map: map
    // 				});

    // 				// For each event, add a listener
    // 				angular.forEach(events, function(val, key) {
    // 					google.maps.event.addListener(marker, key, val);
    // 				});
    				
    // 			})

    // 		}
    // 	}	

    // })

    .directive('geojson', function () {

    	return {
    		restrict: 'E',
    		scope: { 
    			url: '&',
    			style: '&',
    			events: '&'
    		},
    		require:'^map',
    		controller: function ($scope) {

    			// Wait until map is initialized
    			$scope.$watch(function(){$scope.$parent.map}, function(){

    				console.log($scope)

    				var map = $scope.$parent.map;
    				var url = $scope.url();
	    			var style = $scope.style();
	    			var events = $scope.events();

    				map.data.loadGeoJson(url);
    				map.data.setStyle(style);

    				// For each event, add a listener
    				angular.forEach(events, function(val, key) {
    					map.data.addListener(key, val)
    				});

    			});

    		}
    	}	

    })