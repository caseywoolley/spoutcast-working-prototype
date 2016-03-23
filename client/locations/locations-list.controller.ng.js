'use strict'

angular.module('spoutCastApp')
.controller('LocationsListCtrl', function($scope, $state, $meteor, $ionicListDelegate, $ionicScrollDelegate, $ionicModal, MapService, ReviewService) {
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

  // $scope.history = function() {
  //   return JSON.stringify($ionicHistory.viewHistory(), null, 2);
  // };

  //TODO: insert data at creation
  // $scope.locations.forEach(function(location) {
  //   Locations.update({ _id: location._id}, {$set: {loc: { type: "Point", coordinates:[location.latLng.lng, location.latLng.lat]}}});
  //     //Locations.update({ _id: location._id}, {$unset: {test: ''}});
  // });
  
  
  $scope.addLocation = function(){
    var location = Session.get('location');
    $scope.newLocation.latLng = location.latLng;
    $scope.newLocation.gPlaceId = location.place_id;
    var streetAddress = [];
    streetAddress[0] = location.address_components[0].short_name + ' ' + location.address_components[1].short_name;
    streetAddress[1] = location.address_components[2].short_name + ', ' + location.address_components[4].short_name + ' ' + location.address_components[6].short_name;
    $scope.newLocation.streetAddress = streetAddress;
    // $scope.newLocation.formatted_address = Session.get('address');
    $scope.modal.show();
  };

  $scope.myAddress = function() {
    return Session.get('location');
  };

  // $scope.newLocationAddress = function(latLng){
  //   MapService.reverseGeo(function(loc){
  //     $scope.newLocation.formatted_address = loc.formatted_address;
  //     return loc.address;
  //   });
  // };

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
        // ReviewService.setCurrentReview(review);
      }
    } else {
      $state.go('tabs.login');
    }
  };

  $scope.save = function() {
    // if ($scope.form.$valid) {
      var latLng = $scope.newLocation.latLng;
      // $scope.newLocation.latLng = {};
      //temporary: parsefloat for manual geo entry while testing
      // $scope.newLocation.latLng.lat = parseFloat(latLng.lat);
      // $scope.newLocation.latLng.lng = parseFloat(latLng.lng);
      //Geospacial index
      $scope.newLocation.loc = { 
        type: "Point",
        coordinates: [latLng.lng, latLng.lat]
      };
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