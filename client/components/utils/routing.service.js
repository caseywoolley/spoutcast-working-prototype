'use strict'

angular.module('spoutCastApp')
.service('RoutingService', function($ionicHistory, $location) {

    var goBack = function() {
    	if ($ionicHistory.backView()) {
		  	$ionicHistory.goBack();
		  } else {
		  	$location.path('/');
		  }
    };

    return {
      goBack: goBack
    };
});

