
angular.module("ngMaps")
	.factory("GeoJSONService", function() {

	  return {
	    Point: Point,
	    LineString: LineString,
	    Polygon: Polygon
	  };

	  // Passes coords to google maps in reverse order
	  // Remember GeoJSON is Lon Lat instead of Lat Lon
	  function toLatLng(c) {
	    return new google.maps.LatLng(c[1], c[0]);
	  }

	  // Shared event setter
	  function setEvents(events, feature, map) {
			for (var eventType in events) {
	      google.maps.event.addListener(feature, eventType, function(e) {
	        events[eventType](e, feature, map);
	      });
	    }
	    return feature;
	  }

	  //-----------------------------------------//
	  //  ___  ___ ___ _  _ _____ 
	  // | _ \/ _ \_ _| \| |_   _|
	  // |  _/ (_) | || .` | | |  
	  // |_|  \___/___|_|\_| |_|  
	  //
	  //-----------------------------------------//
	                            

	  function Point(geometry, properties, options, events, map) {

	  	var _coords = geometry.coordinates;
      var _properties = properties;
	    var _options = options(_coords, properties, map, 0);

	    _options.position = toLatLng(_coords);
	    _options.map = map;

	    var _feature = new google.maps.Marker(_options);

	    _feature = setEvents(events, _feature, map);

	    function setOptions(options) {
	    	_options = options(_coords, properties, map, 0);
        _options.properties = properties;
	      _feature.setOptions(_options);
	    }

	    function setPosition(coords) {
	    	_coords = coords;
	    	_feature.setPosition(toLatLng(coords))
	    }

      function setProperties(properties) {
        _properties = properties;
        setOptions(options);
      }

	    function setVisible(visible) {
	    	_feature.setVisible(visible);
	    }

	    function getMapFeature() { 
	    	return _feature;
	    }

	    return {
	      setOptions: setOptions,
	      setEvents: setEvents,
	      setPosition: setPosition,
        setProperties: setProperties,
	      setVisible: setVisible,
	      getMapFeature: getMapFeature
	    };

	  }

	  //-----------------------------------------//
	  //  _    ___ _  _ ___ ___ _____ ___ ___ _  _  ___ 
	  // | |  |_ _| \| | __/ __|_   _| _ \_ _| \| |/ __|
	  // | |__ | || .` | _|\__ \ | | |   /| || .` | (_ |
	  // |____|___|_|\_|___|___/ |_| |_|_\___|_|\_|\___|
	  //                                              
	  //-----------------------------------------//


	  function LineString(geometry, properties, options, events, map) {

	  	var _coords = geometry.coordinates;
	  	var _properties = properties;
	    var _options = options(_coords, properties, map, 0);

	    _options.path = _coords.map(toLatLng);
	    _options.map = map;

	    var _feature = new google.maps.Polyline(_options);

	    var _opacity;

	    _feature = setEvents(events, _feature, map);

	    function setOptions(options) {
	    	_options = options(_coords, properties, map, 0);
	      _feature.setOptions(_options);
	    }

	    function setProperties(properties) {
        _properties = properties;
        setOptions(options);
      }

      function setPath(coords) {
      	_coords = coords;
	    	_feature.setPath(coords.map(toLatLng))
	    }

	    function setVisible(visible) {
	    	_feature.setVisible(visible);
	    }

	    function setOpacity(opacity) {
	    	if (opacity > 1) opacity = opacity/100;
	    	_opacity = opacity;
	    	_options.strokeOpacity = _opacity;
	    	_feature.setOptions(_options);
	    }

	    function getMapFeature() { 
	    	return _feature;
	    }

	    return {
	      setOptions: setOptions,
	      setEvents: setEvents,
	      setProperties: setProperties,
	      setPath: setPath,
	      setVisible: setVisible,
	      setOpacity: setOpacity,
	      getMapFeature: getMapFeature
	    };

	  }

	  //-----------------------------------------//
	  //  ___  ___  _ __   _____  ___  _  _ 
	  // | _ \/ _ \| |\ \ / / __|/ _ \| \| |
	  // |  _/ (_) | |_\ V / (_ | (_) | .` |
	  // |_|  \___/|____|_| \___|\___/|_|\_|
	  //
	  //-----------------------------------------//


	  function Polygon(geometry, properties, options, events, map) {

	    // Create options
	    var _coords = geometry.coordinates;
	    var _properties = properties;
	    var _options = options(_coords, properties, map, 0);

	    // Format points in google maps LatLng class
	    _options.paths = _coords.map(function(c) {
	      return c.map(toLatLng);
	    });
	    _options.map = map;

	    // Map feature
	    var _feature = new google.maps.Polygon(_options);

	    var _opacity;

	    _feature = setEvents(events, _feature, map);

	    function setOptions(options) {
	    	_options = options(_coords, properties, map, 0);
	      _feature.setOptions(_options);
	    }

	    function setVisible(visible) {
	    	_feature.setVisible(visible);
	    }

	    function setProperties(properties) {
        _properties = properties;
        setOptions(options);
      }

      function setPath(coords) {
      	_coords = coords;
      	_feature.setPaths(coords.map(function(c) {
		      return c.map(toLatLng);
		    }));
      }

	    function setOpacity(opacity) {
	    	if (opacity > 1) opacity = opacity/100;
	    	_opacity = opacity;
	    	_options.strokeOpacity = _opacity;
	    	_options.fillOpacity = _opacity;
	    	_feature.setOptions(_options);
	    }

	    function getMapFeature() { 
	    	return _feature;
	    }

	    return {
	      setOptions: setOptions,
	      setEvents: setEvents,
	      setVisible: setVisible,
	      setPath: setPath,
	      setProperties: setProperties,
	      setOpacity: setOpacity,
	      getMapFeature: getMapFeature
	    };

	  }
  
	});