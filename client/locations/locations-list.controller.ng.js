'use strict'

angular.module('spoutCastApp')
.controller('LocationsListCtrl', function($scope, $state, $ionicScrollDelegate, $ionicModal, MapService, ReviewService) {

  $scope.newLocation = {};
  $scope.user = Meteor.user()
  var geocoder = new google.maps.Geocoder();


  $scope.autorun(function() {
      $scope.latLng = Geolocation.latLng() || {lat: 30.182431, lng: -94.023635};
      $scope.newLocation.latLng = $scope.latLng;
      MapService.reverseGeo($scope.latLng, function(data){
        $scope.$apply(function(){
          $scope.newLocation.formatted_address = data.address;
        });
      });

  });


  $ionicModal.fromTemplateUrl('templates/add-location.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
  $scope.helpers({
    locations: function() {
      return Locations.find({
        loc: {
          $near: {
            $geometry: {
              type: 'Point', 
              coordinates: [$scope.getReactively('latLng.lng'), $scope.getReactively('latLng.lat')],
            },
            $maxDistance: 100
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

  // $scope.locations.forEach(function(location) {
  //   Locations.update({ _id: location._id}, {$set: {loc: { type: "Point", coordinates:[location.latLng.lng, location.latLng.lat]}}});
  //     //Locations.update({ _id: location._id}, {$unset: {test: ''}});
  // });
  
  // $scope.reviews.forEach(function(review) {
  //   if (review.latLng){

  //     Reviews.update({ _id: review._id}, {$set: {loc: { type: "Point", coordinates:[review.latLng.lng, review.latLng.lat]}}});
  //   }
  //     //Locations.update({ _id: reviews._id}, {$unset: {test: ''}});
  // });


  $scope.myLocation = function() {
    return Session.get('location');
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