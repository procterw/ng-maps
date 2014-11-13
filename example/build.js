var app=angular.module("App",["ngRoute","ngAnimate","ui.slider","ng-data-map","ngSanitize"]).config(["$locationProvider","$routeProvider",function($locationProvider,$routeProvider){$routeProvider.when("/map",{templateUrl:"templates/map.html"}).when("/marker",{templateUrl:"templates/marker.html"}).when("/points",{templateUrl:"templates/points.html"}).when("/geopoints",{templateUrl:"templates/geopoints.html"}).when("/geopolygons",{templateUrl:"templates/geopolygons.html"}).when("/polygons",{templateUrl:"templates/polygons.html"}).otherwise({redirectTo:"/map"})}]);angular.module("App").controller("control",["$scope",function(){}]),angular.module("App").controller("geopoints",["$scope",function($scope){$scope.map={center:[39,-121],options:{zoom:6,streetViewControl:!1,scrollwheel:!1}},$scope.stations={url:"data/AirNow_Sites_PM2.5.geojson",events:{click:function(e,m){var lat=e.latLng.lat(),lng=e.latLng.lng(),name=m.getProperty("siteName");alert(lat+" "+lng+" "+name)}}},$scope.parameters=[{name:"url",type:"string",details:"A path to a .geojson file"},{name:"visible",type:"boolean",details:"Is this layer visible?"},{name:"options",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions'>MarkerOptions object specification</a>"},{name:"events",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#Marker'>Marker events specification</a>"}]}]),angular.module("App").controller("geopolygons",["$scope",function($scope){$scope.map={center:[39,-121],options:{zoom:6,streetViewControl:!1,scrollwheel:!1}},$scope.states={url:"data/states.geojson"},$scope.parameters=[{name:"url",type:"string",details:"A path to a .geojson file"},{name:"visible",type:"boolean",details:"Is this layer visible?"},{name:"options",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions'>MarkerOptions object specification</a>"},{name:"events",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#Marker'>Marker events specification</a>"}]}]),angular.module("App").controller("infowindow",["$scope",function(){}]),angular.module("App").controller("Main",["$scope","$location",function($scope,$location){$scope.location=function(){return $location.path()},$scope.options=["map","marker","points","polygons","geopoints","geopolygons","polylines","shapes","overlay","control","infowindow"]}]),angular.module("App").controller("map",["$scope",function($scope){$scope.map={center:[39,-121],options:{zoom:4,streetViewControl:!1,scrollwheel:!1}},$scope.parameters=[{name:"center",type:"array",details:"An array of two numbers."},{name:"options",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#MapOptions'>MapOptions object specification</a>"},{name:"events",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#Map'>Map events specification</a>"}]}]),angular.module("App").controller("marker",["$scope",function($scope){$scope.map={center:[39,-121],options:{zoom:6,streetViewControl:!1,scrollwheel:!1}},$scope.marker={position:[39,-121],decimals:4,options:{draggable:!0}},$scope.parameters=[{name:"position",type:"array",details:"An array of two numbers."},{name:"lat",type:"float",details:"A numeric latitude value."},{name:"lng",type:"float",details:"A numeric longitude value."},{name:"decimals",type:"int",details:"Number of decimal places to round to when dragging"},{name:"options",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions'>MarkerOptions object specification</a>"},{name:"events",type:"object",details:"Object properties follow <a href='https://developers.google.com/maps/documentation/javascript/reference#Marker'>Marker events specification</a>"}]}]),angular.module("App").controller("overlay",["$scope",function(){}]),angular.module("App").controller("points",["$scope",function($scope){$scope.map={center:[47.5,-122.5],options:{zoom:6,streetViewControl:!1,scrollwheel:!1}},$scope.points={coords:[[47,-122],[48,-123],[47,-123],[48,-122]],options:{draggable:!0},events:{click:function(e,m){alert(e,m)}},decimals:3}}]),angular.module("App").controller("polygons",["$scope",function($scope){$scope.map={center:[25,-70],options:{streetViewControl:!1,scrollwheel:!1},zoom:4},$scope.polygons={coords:[[[[25.774252,-80.190262],[18.466465,-66.118292],[32.321384,-64.75737],[25.774252,-80.190262]]],[[[26.774252,-79.190262],[19.466465,-65.118292],[33.321384,-64.75737],[26.774252,-79.190262]]]],options:function(){return{fillColor:"#e67e22",strokeColor:"#d35400"}},opacity:50}}]),angular.module("App").controller("polylines",["$scope",function(){}]),angular.module("App").controller("shapes",["$scope",function(){}]);