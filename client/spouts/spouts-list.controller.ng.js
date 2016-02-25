'use strict'

angular.module('spoutCastApp')
.controller('SpoutsListCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, GeoService, $reactive) {

  $scope.awsBucket = Meteor.settings.public.AWSBucket;
  //AWS Cloudfront: http://s8apxnqi2hkkl.cloudfront.net/https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/HWWWzSPCEodfCMtXk/56cf12d67ffa78f0fb092feb.mov

  $scope.helpers({
    spouts: function() {
      return Spouts.find({});
    }
  });
                  
  $scope.subscribe('spouts', function() {
    return [{}, $scope.getReactively('search')];
  });
                  
  $scope.remove = function(spout) {
    if (Meteor.userId() && spout.owner === Meteor.userId()._id){
      Spouts.remove(spout._id);
      $ionicScrollDelegate.resize();
    } else {
      //TODO: error handling
      console.log('Must be your Spout to delete')
    }
  };

});