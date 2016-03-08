'use strict'

angular.module('spoutCastApp')
.controller('LocationsListCtrl', function($scope, $state, $ionicScrollDelegate, $ionicModal, MapService, ReviewService) {

  $scope.newLocation = {};

  $scope.autorun(function() {
    $scope.latLng = MapService.updateLocation();
  });

  $ionicModal.fromTemplateUrl('templates/add-location.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
  $scope.helpers({
    // locations: function(){
    //   return Locations.find({});
    // },
    locations: function() {
      return Locations.find({
        loc: {
          $near: {
            $geometry: {
              type: 'Point', 
              coordinates: [$scope.getReactively('latLng.lng'), $scope.getReactively('latLng.lat')],
            },
            $maxDistance: MapService.reviewRadius
          }
        }
      });
    },
    reviews: function() {
      return Reviews.find({});
    }
  });
                  
  $scope.subscribe('locations', function() {
    return [{}, $scope.getReactively('latLng')];
  });

  $scope.subscribe('reviews', function() {
    return [{}, $scope.getReactively('search')];
  });

  //TODO: insert data at creation
  $scope.locations.forEach(function(location) {
    Locations.update({ _id: location._id}, {$set: {loc: { type: "Point", coordinates:[location.latLng.lng, location.latLng.lat]}}});
      //Locations.update({ _id: location._id}, {$unset: {test: ''}});
  });
  
  
  $scope.addLocation = function(){
    $scope.newLocation.latLng = $scope.latLng;
    $scope.modal.show();
  };

  $scope.myAddress = function() {
    return Session.get('address');
  };

  $scope.newLocationAddress = function(latLng){
    MapService.reverseGeo(latLng, function(loc){
      $scope.newLocation.formatted_address = loc.address;
      return loc.address;
    });
  };

  $scope.getReview = function(location){
    if (Meteor.user()) {
      return _.findWhere($scope.reviews, {location_id: location._id, user_id: Meteor.user()._id}); 
    }
  };

  $scope.hasReviews = function(location){
    return _.findWhere($scope.reviews, {location_id: location._id}); 
  };

  $scope.editLocation = function(location){
    console.log(location)
    $state.go('location-detail', {id: location._id});  
  };

  $scope.addReview = function(location){
    var existingReview = $scope.getReview(location);
    if (existingReview) {
      $state.go('review-detail', {id: existingReview._id});  
    } else { 
      var review = {};
      review.user_id = Meteor.user()._id;
      review.location_id = location._id;
      review.latLng = $scope.latLng;
      Reviews.insert(review);
      // ReviewService.setCurrentReview(review);
    }
  };

  $scope.save = function() {
    //TODO: if not logged in send to login page
    // if ($scope.form.$valid) {
      var latLng = $scope.newLocation.latLng;
      $scope.newLocation.latLng = {};
      //temporary: parsefloat for manual geo entry while testing
      $scope.newLocation.latLng.lat = parseFloat(latLng.lat);
      $scope.newLocation.latLng.lng = parseFloat(latLng.lng);
      Locations.insert($scope.newLocation);
      $scope.newLocation = {};
      $scope.newLocation.latLng = $scope.latLng;
      $ionicScrollDelegate.resize();
      $scope.modal.hide();
    // }
  };
                  
  $scope.remove = function(location) {
    Locations.remove({_id:location._id});
    $ionicScrollDelegate.resize();
  };
});