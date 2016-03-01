'use strict'

angular.module('spoutCastApp')
.controller('LocationDetailCtrl', function($scope, $stateParams) {
  
  $scope.helpers({
    location: function() {
      return Locations.findOne({ _id: $stateParams.locationId }); 
    }
  });
  
  $scope.subscribe('locations');
  
  $scope.save = function() {
    if($scope.form.$valid) {
      delete $scope.location._id;
      Locations.update({
        _id: $stateParams.locationId
      }, {
        $set: $scope.location
      }, function(error) {
        if(error) {
          console.log('Unable to update the location'); 
        } else {
          console.log('Done!');
        }
      });
    }
  };
        
  $scope.reset = function() {
    $scope.location.reset();
  };
});