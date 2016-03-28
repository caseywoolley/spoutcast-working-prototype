'use strict'

angular.module('spoutCastApp')
.controller('LocationsListCtrl', function($scope, $state, $meteor, $ionicListDelegate, $ionicScrollDelegate, $ionicModal, MapService) {
  $scope.newLocation = {};

  $scope.autorun(function() {
    $scope.latLng = MapService.updateLocation();
  });

  $ionicModal.fromTemplateUrl('client/locations/location-add.view.ng.html', {
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
  
  $scope.addLocation = function(){
    if (!Meteor.user()){ 
      $state.go('tabs.login');
      return;
    }
    var location = Session.get('location');
    $scope.newLocation.latLng = $scope.latLng;
    $scope.newLocation.gPlaceId = location.place_id;
    $scope.newLocation.address_components = location.address_components;
    var streetAddress = [];
    var address = location.formatted_address.split(/\s*,\s*/);
    address.pop();
    streetAddress[0] = address.slice(0, -2).join(', ');
    streetAddress[1] = address.slice(-2).join(', ');
    $scope.newLocation.streetAddress = streetAddress;
    $scope.modal.show();
  };

  $scope.myAddress = function() {
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
    $ionicListDelegate.closeOptionButtons();
    $state.go('tabs.location-detail', {id: location._id});
  };

  $scope.addReview = function(location){
    $ionicListDelegate.closeOptionButtons();
    if (Meteor.user()){
      var existingReview = $scope.getReview(location);
      if (existingReview) {
        $state.go('tabs.review-detail', {id: existingReview._id});  
      } else { 
        var review = {};
        review.user_id = Meteor.user()._id;
        review.location_id = location._id;
        review.latLng = $scope.latLng;
        review.loc = {
          type: 'Point',
          coordinates: [location.latLng.lng, location.latLng.lat]
        };
        Reviews.insert(review);
      }
    } else {
      $state.go('tabs.login');
    }
  };

  $scope.save = function() {
    var latLng = $scope.newLocation.latLng;
    $scope.newLocation.loc = { 
      type: "Point",
      coordinates: [latLng.lng, latLng.lat]
    };
    Locations.insert($scope.newLocation);
    $scope.newLocation = {};
    $scope.newLocation.latLng = $scope.latLng;
    $ionicScrollDelegate.resize();
    $scope.modal.hide();
  };
                  
  $scope.remove = function(location) {
    Locations.remove({_id:location._id});
    $ionicScrollDelegate.resize();
  };
});