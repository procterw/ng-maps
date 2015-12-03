angular.module('App')
	.controller('textLabels', ['$scope', function($scope){

  	$scope.map = {
      center: [39, -121],
      options: function() {
          return {
            streetViewControl: false,
            scrollwheel: false
          }
      }
    };

		$scope.text = {
      features: [
        { text: "text1", coords: [39, -121] },
        { text: "text2", coords: [39.5, -121] }
      ],
      visible: true,
      events: {
        click: function(a,b,c,d) {
          console.log(a,b,c,d);
        }
      }
    };

    $scope.marker = {
      position: [39, -121],
      decimals: 4,
      options: function() {
        return { draggable: true };
      }
    }

	}]);