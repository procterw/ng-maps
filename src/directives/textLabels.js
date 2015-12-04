angular.module('ngMaps')
  .directive('textLabels', [function() {
    return {
      restrict: 'E',
      scope: {
        features: '=',    // array [{text, coords}]
        events: '=',      // object {event:function(), event:function()}
        visible: '='
      },
      require: '^map',
      link: function($scope, $element, $attrs, parent) {

        $scope.$watch(function() {
          parent.getMap();
        }, function() {

          var map = parent.getMap();

          var opts = $scope.options? $scope.options() : {};

          var textLabels = [];

          $scope.$watch("visible", function(visible) {
            if (visible !== false) {
              textLabels.forEach(function(textLabel) { textLabel.setMap(map); });
            } else {
              textLabels.forEach(function(textLabel) { textLabel.setMap(null); });
            }
          });

          angular.forEach($scope.features, function(feature) {

            textLabel = angular.extend(new google.maps.OverlayView(), {

              onAdd: function() {

                div = document.createElement('div');

                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';

                console.log($attrs.class)

                div.className = $attrs.class;
                div.innerHTML = feature.text;

                var panes = this.getPanes();
                panes.overlayMouseTarget.appendChild(div);

                angular.forEach($scope.events, function(val, key) {
                  div.addEventListener(key, function(e) {
                    val(e, feature, map, textLabels);
                  });
                });

                this.div_ = div;

              },
              draw: function() {

                var coords = feature.coords;

                var overlayProjection = this.getProjection();
                var pos = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(coords[0], coords[1]));

                var div = this.div_;

                var boundingRect = div.getBoundingClientRect();
                
                div.style.left = (pos.x - boundingRect.width/2) + 'px';
                div.style.top = (pos.y - boundingRect.height/2) + 'px';

              },
              onRemove: function() {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
              }
            });

            textLabel.setMap(map);

            textLabels.push(textLabel);

          });

        });
      }
    };
  }]);