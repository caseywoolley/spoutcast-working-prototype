'use strict'

angular.module('spoutCastApp')
.directive('nav', function($state, $ionicHistory) {
  return {
    restrict: 'AE',
    templateUrl: 'client/components/nav/nav.view.ng.html',
    replace: true,
    link: function(scope, elem, attrs) {
      scope.getState = function() {
        return $state.current.name;
      };

      scope.goTo = function(location) {
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go(location);
      };
    }
  };
});