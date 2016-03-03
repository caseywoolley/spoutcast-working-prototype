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
  //   link: function(scope, element, attrs, ctrl, transclude) {
	 //    scope.$watch("spout",function(newValue,oldValue) {
  //   		console.log(element);
  //   		if (previousContent) {
  //       	previousContent.remove();
  //   		}
  //       transclude(function (clone) {
  //           console.log('relinking');
  //           element.parent().append(clone);
  //           previousContent = clone;
  //       });
	 //    });
		// }

    controller: function ($scope, $element) {
      $scope.username = $scope.spout.user_id;
    }
  };
});