'use strict'

angular.module('spoutCastApp')
.controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate) {

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.recordSpout = function(){
    MeteorCamera.getPicture(function(data){
      console.log('done');
    });
  };

  $scope.helpers({
    spouts: function() {
      return Spouts.find({});
    }
  });
                  
  $scope.subscribe('spouts', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.save = function() {
    if ($scope.form.$valid) {
      Spouts.insert($scope.newSpout);
      $scope.newSpout = undefined;
      $ionicScrollDelegate.resize();
    }
  };
                  
  $scope.remove = function(spout) {
    Spouts.remove({_id:spout.id});
    $ionicScrollDelegate.resize();
  };
});