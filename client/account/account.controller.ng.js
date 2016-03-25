'use strict'

angular.module('spoutCastApp')
.controller('AccountCtrl', function($scope, $meteor, $ionicPopup, $cordovaFile, RoutingService, ReviewService) {

  $scope.editMode = false;
	
	if (Meteor.user().profile) {
  	$scope.userName = Meteor.user().profile.name;
	}

  $scope.avatar = Avatar.getUrl(Meteor.user());

  if (Meteor.isCordova) {
    $scope.localPath = '/local-filesystem' + cordova.file.syncedDataDirectory.slice(7) + 'media/';
  }

  $scope.helpers({
      reviews: function() {
        return Reviews.find({
          user_id: Meteor.userId(),
          active: true
        });
      },
      drafts: function() {
        return Reviews.find({
          user_id: Meteor.userId(),
          active: { "$exists" : false }
        });
      }
    });


  $scope.subscribe('reviews', function() {
    return [{}, $scope.getReactively('search')];
  });


  $scope.addS = function(items) {
    if (items.length === 1) {
      return '';
    } 
    return 's';
  };

  // A confirm dialog
  $scope.confirmDeleteAccount = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Your Account?',
     template: 'Are you sure you want to permenantly delete your account and all your reviews?  This can\'t be undone.'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.deleteAccount();
     } else {
       console.log('cancel');
     }
   });
  };

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
    var allReviews = $scope.reviews.concat($scope.drafts);
    console.log('delete account');
    ReviewService.removeGroup(allReviews);
    //delete user
    Meteor.users.remove({ _id: Meteor.userId() });
    $meteor.logout(); 
    RoutingService.goBack();
  };

  $scope.getUser = function(){
  	return Meteor.user();
  };
});