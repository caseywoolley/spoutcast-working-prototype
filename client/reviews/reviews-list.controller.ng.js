'use strict'

angular.module('spoutCastApp')
.controller('ReviewsListCtrl', function($scope, $ionicScrollDelegate, MapService) {
  $scope.awsBucket = Meteor.settings.public.amazonS3.AWSBucket;

  if (Meteor.isCordova) {
    $scope.localPath = '/local-filesystem' + cordova.file.syncedDataDirectory.slice(7) + 'media/';
  }

  $scope.autorun(function() {
    $scope.latLng = MapService.updateLocation();
  });

  $scope.emptyReviews = [{title:" "},{title:" "}, {title:" "}, {title:" "}, {title:" "}];

  $scope.helpers({
    reviews: function() {
      return Reviews.find({
        loc: {
          $near: {
            $geometry: {
              type: 'Point', 
              coordinates: [$scope.getReactively('latLng.lng'), $scope.getReactively('latLng.lat')],
            }
          }
        },
        active: true
      });
    }
  });

  $scope.subscribe('reviews', function() {
    return [{}, $scope.getReactively('latLng')];
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