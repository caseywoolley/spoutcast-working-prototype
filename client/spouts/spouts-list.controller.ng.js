'use strict'

angular.module('spoutCastApp')
.controller('SpoutsListCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate) {

  var user = Meteor.user();

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.helpers({
    spouts: function() {
      return Spouts.find({});
    }
  });
                  
  $scope.subscribe('spouts', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid && Meteor.userId()) {
      Spouts.insert($scope.newSpout);
      $scope.newSpout = undefined;
      $ionicScrollDelegate.resize();
    }
  };
                  
  $scope.remove = function(spout) {
    if (Meteor.userId() && spout.owner === Meteor.userId()._id){
      Spouts.remove({_id:spout.id}).then(function(){console.log('promise');});
      $ionicScrollDelegate.resize();
    } else {
      console.log('nope')
    }
  };
});