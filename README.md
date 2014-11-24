ng-maps
==============

[Find examples and documentation on the ng-maps website](http://willleahy.info/ng-maps/#/)

ng-maps offers a set of Google Maps directives for AngularJS. The focus is on 

##Dependencies

The only requirements for ng-maps are AngularJS and Google Maps. Be sure to include Google Maps before ng-maps in your HTML.

```
<script src='//maps.googleapis.com/maps/api/js?libraries=geometry'></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular.min.js"></script>
```

##Install

If you use [Bower](https://github.com/bower/bower) just execute the following command in your directory:

```
bower install ng-maps
```
You can also download either 'ng-maps.js' or 'ng-maps.min.js' directly from the dist directory.

In your HTML, include the following:
```
<script src="bower_components/ng-maps/dist/ng-maps.min.js"></script>
```
Finally, be sure to include ng-maps in your angular.module definition:
```
var app = angular.module('App', ['ngMaps'])
```
Now you're ready to get started!
