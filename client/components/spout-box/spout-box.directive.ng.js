'use strict'

angular.module('spoutCastApp')
.directive('spoutBox', function() {
  return {
  	//transclude: 'element',
    restrict: 'AE',
    scope: {
    	spout: '=',
    	'video': '=',
    	'poster': '=',
      'remove': '='
    },
    templateUrl: 'client/components/spout-box/spout-box.view.ng.html',
    controller: function ($scope, $element) {
      $scope.username = $scope.spout.user_id;
    }
  };
});