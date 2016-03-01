'use strict'

angular.module('spoutCastApp')
.controller('LocationsListCtrl', function($scope, $ionicScrollDelegate) {

    
  $scope.helpers({
    locations: function() {
      return Locations.find({});
    }
  });
                  
  $scope.subscribe('locations', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid) {
      Locations.insert($scope.newLocation);
      $scope.newLocation = undefined;
      $ionicScrollDelegate.resize();
    }
  };
                  
  $scope.remove = function(location) {
    Locations.remove({_id:location.id});
    $ionicScrollDelegate.resize();
  };
});