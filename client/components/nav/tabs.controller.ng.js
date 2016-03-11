'use strict'

angular.module('spoutCastApp')
.controller('TabsController', function($scope, $rootScope, $meteor, $state, $ionicHistory, $ionicSideMenuDelegate) {

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.logout = function() {
		$meteor.logout();
		$scope.toggleLeft();
	};

});