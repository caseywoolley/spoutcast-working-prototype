'use strict'

angular.module('spoutCastApp')
.controller('SpoutsListCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate) {

  $scope.user = Meteor.user();
  $scope.awsBucket = 'https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/';

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
   // if (Meteor.userId() && spout.owner === Meteor.userId()._id){
      Spouts.remove(spout._id);
      $ionicScrollDelegate.resize();
   // } else {
      //console.log('nope')
    //}
  };

});