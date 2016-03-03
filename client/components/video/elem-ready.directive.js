'use strict'

//http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded
angular.module('spoutCastApp')
.directive('elemReady', function( $parse ) {
  return {
    restrict: 'A',
    link: function($scope, el, attrs) {
      console.log('el', el)
      // el.ready(function(){
        $scope.$apply(function(){
          var func = $parse(attrs.elemReady);
          func($scope);
        });
      // });

    }

  };
});