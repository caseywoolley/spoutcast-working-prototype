'use strict'

angular.module('spoutCastApp')
.controller('LocationReviewsCtrl', function($scope, $stateParams, $ionicScrollDelegate, MapService) {
  $scope.awsBucket = Meteor.settings.public.amazonS3.AWSBucket;

  if (Meteor.isCordova) {
    $scope.localPath = '/local-filesystem' + cordova.file.syncedDataDirectory.slice(7) + 'media/';
  }
  $scope.location = Locations.findOne({ _id: $stateParams.id });
  // $scope.isOwner = $scope.user._id === Meteor.userId();

  $scope.helpers({
    reviews: function() {
      return Reviews.find({
        location_id: $scope.location._id,
        active: true
      },
      {
        sort: { published: -1 } 
    });
    }
  });

  $scope.subscribe('reviews', function() {
    return [{}, $scope.getReactively('search')];
  });
         

  $scope.save = function() {
    if ($scope.form.$valid) {
      Reviews.insert($scope.newReview);
      $scope.newReview = undefined;
      $ionicScrollDelegate.resize();
    }
  };
                  
  $scope.remove = function(review) {
    console.log(review);
    Reviews.remove({_id:review._id});
    $ionicScrollDelegate.resize();
  };
});