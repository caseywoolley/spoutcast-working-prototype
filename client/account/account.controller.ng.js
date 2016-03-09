'use strict'

angular.module('spoutCastApp')
.controller('AccountCtrl', function($scope) {
  $scope.viewName = 'Account';

  $scope.getUser = function(){
  	return Meteor.user();
  };
});