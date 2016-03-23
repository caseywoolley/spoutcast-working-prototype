'use strict'

angular.module('spoutCastApp')
.controller('AccountCtrl', function($scope) {

  $scope.editMode = false;
	
	if (Meteor.user().profile) {
  	$scope.userName = Meteor.user().profile.name;
	}

  $scope.avatar = Avatar.getUrl(Meteor.user());

  $scope.toggleEditMode = function() {
    $scope.editMode = !$scope.editMode;
    if ($scope.editMode) { $scope.newName = $scope.userName; }
  };

  $scope.update = function(userName) {
    $scope.userName = userName;
  	Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name": userName}});
    $scope.toggleEditMode();
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