'use strict'

angular.module('spoutCastApp')
.controller('LocationsListCtrl', function($scope, $ionicScrollDelegate, $ionicModal, GeoService) {

  $scope.newLocation = {};

  $scope.autorun(function() {
      // $scope.latLng = Geolocation.latLng();
      $scope.newLocation.latLng = Geolocation.latLng();
      GeoService.getAddress($scope.newLocation.latLng, function(data){
        $scope.$apply(function(){
          $scope.newLocation.formatted_address = data.address;
        });
      }); 
  });

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
  $scope.helpers({
    locations: function() {
      return Locations.find({});
    }
  });
                  
  $scope.subscribe('locations', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.save = function() {
    // if ($scope.form.$valid) {
      Locations.insert($scope.newLocation);
      $scope.newLocation = {};
      $ionicScrollDelegate.resize();
      $scope.modal.hide();
    // }
  };
                  
  $scope.remove = function(location) {
    Locations.remove({_id:location._id});
    $ionicScrollDelegate.resize();
  };
});