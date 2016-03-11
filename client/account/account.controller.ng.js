'use strict'

angular.module('spoutCastApp')
.controller('AccountCtrl', function($scope) {
	
	if (Meteor.user().profile) {
  	$scope.userName = Meteor.user().profile.name;
	}

  $scope.avatar = Avatar.getUrl(Meteor.user());

  $scope.update = function(updates) {
  	Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name":"Carlos"}})
  };

  $scope.changePassword = function() {

  };

  $scope.deleteAccount = function() {
    Users.remove({_id: Meteor.userId()});
  };

  $scope.getUser = function(){
  	return Meteor.user();
  };
});