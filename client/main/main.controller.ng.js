'use strict'

angular.module('spoutCastApp')
.controller('MainCtrl', function($scope, $ionicScrollDelegate) {

    
  $scope.helpers({
    things: function() {
      return Things.find({});
    }
  });
                  
  $scope.subscribe('things', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid) {
      Things.insert($scope.newThing);
      $scope.newThing = undefined;
      $ionicScrollDelegate.resize();
    }
  };
                  
  $scope.remove = function(thing) {
    Things.remove({_id: thing._id});
    $ionicScrollDelegate.resize();
  };
});