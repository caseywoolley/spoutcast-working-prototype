'use strict'

angular.module('spoutCastApp')
.controller('LocationDetailCtrl', function($scope, $stateParams, RoutingService) {
  
  $scope.helpers({
    location: function() {
      return Locations.findOne({ _id: $stateParams.id }); 
    }
  });
  
  $scope.subscribe('locations');

  $scope.update = function(location, updates) {
    updates = _.clone(location);
    delete updates._id;
    Locations.update({_id: location._id }, {$set: updates});
    RoutingService.goBack();
  };
  
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