'use strict'

angular.module('spoutCastApp')
.controller('SpoutsListCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, GeoService, $reactive) {

  $scope.awsBucket = 'https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/';
  $scope.collectionHeight = window.screen.width * 0.73 + 80;
  // var page = 20;

  // $scope.subscribe('images', {
  //     skip: 0,
  //     limit: 2 * page
  // });

  // $scope.images = $meteor.collection(function() {
  //     return Images.find();
  // });

  // $scope.loadMore = function() {
  //     var len = $scope.images.length;
  //     $meteor.subscribe('images', {
  //         skip: len,
  //         limit: page
  //     });
  // };
  console.log('width',window.screen.width)

  $scope.autorun(function(){
    console.log('autorun')
    // $scope.getReactively('test'));
    Session.set('location', Geolocation.latLng());
  });

  $scope.getLoc = function(){
    return Geolocation.latLng();
  };

  $scope.currentLocation = function(){
    return Session.get('location');
  };

  $scope.here = Session.get('location')
  $scope.getReactively('here');


  $scope.helpers({
    spouts: function() {
      return Spouts.find({});
    },
    // currentLocation: GeoService.currentLocation,
    address: GeoService.address
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