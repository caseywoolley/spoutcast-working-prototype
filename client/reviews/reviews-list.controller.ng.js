'use strict'

angular.module('spoutCastApp')
.controller('ReviewsListCtrl', function($scope, $ionicScrollDelegate, MapService) {

  $scope.awsBucket = Meteor.settings.public.amazonS3.AWSBucket;
  console.log($scope.awsBucket)

  if (Meteor.isCordova) {
    $scope.localPath = '/local-filesystem' + cordova.file.syncedDataDirectory.slice(7) + 'media/';
  }

  $scope.autorun(function() {
    $scope.latLng = MapService.updateLocation();
  });

  $scope.helpers({
    // reviews: function() {
    //   return Reviews.find({active: true});
    // }
    reviews: function() {
      return Reviews.find({
        loc: {
          $near: {
            $geometry: {
              type: 'Point', 
              coordinates: [$scope.getReactively('latLng.lng'), $scope.getReactively('latLng.lat')],
            },
            $maxDistance: 1000 * 1609 // 1000 miles
          }
        }
      });
    },
  });

  $scope.subscribe('reviews', function() {
    return [{}, $scope.getReactively('latLng')];
  });

  //TODO: add data at creation
  $scope.reviews.forEach(function(review) {
    if (review.latLng){

      Reviews.update({ _id: review._id}, {$set: {loc: { type: "Point", coordinates:[review.latLng.lng, review.latLng.lat]}}});
    }
      //Locations.update({ _id: reviews._id}, {$unset: {test: ''}});
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