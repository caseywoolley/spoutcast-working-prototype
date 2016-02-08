'use strict'

angular.module('spoutCastApp')
.controller('SpoutDetailCtrl', function($scope, $stateParams) {
  
  $scope.helpers({
    spout: function() {
      return Spouts.findOne({ _id: $stateParams.spoutId }); 
    }
  });
  
  $scope.subscribe('spouts');
  
  $scope.save = function() {
    if($scope.form.$valid) {
      delete $scope.spout._id;
      Spouts.update({
        _id: $stateParams.spoutId
      }, {
        $set: $scope.spout
      }, function(error) {
        if(error) {
          console.log('Unable to update the spout'); 
        } else {
          console.log('Done!');
        }
      });
    }
  };
        
  $scope.reset = function() {
    $scope.spout.reset();
  };
});