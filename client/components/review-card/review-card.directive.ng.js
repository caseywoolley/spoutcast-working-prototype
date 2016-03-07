'use strict'

angular.module('spoutCastApp')
.directive('reviewCard', function() {
  return {
  	//transclude: 'element',
    restrict: 'AE',
    scope: {
    	review: '=',
    	'video': '=',
    	'poster': '=',
      'remove': '='
    },
    templateUrl: 'client/components/review-card/review-card.view.ng.html',
    controller: function ($scope, $element) {
      $scope.username = $scope.review.user_id;
    }
  };
});