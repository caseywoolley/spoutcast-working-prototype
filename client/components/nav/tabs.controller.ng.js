'use strict'

angular.module('spoutCastApp')
.controller('TabsController', function($scope, $rootScope, $meteor, $state, $ionicHistory, $ionicSideMenuDelegate) {

	$scope.currentUserId = function() {
		return Meteor.userId();
	};

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.logout = function() {
		$meteor.logout();
		$scope.toggleLeft();
	};

});