'use strict'

angular.module('spoutCastApp')
.controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, $window) {

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.recordSpout = function(){
    // MeteorCamera.getPicture(function(data){
    //   console.log('done');
    // });
    // capture callback
    console.log('record')
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
            console.log(path);
        }
    };

    // capture error callback
    var captureError = function(error) {
        $window.navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    // start video capture
    //navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});
    console.log(navigator.device)
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
    if ($scope.form.$valid && Meteor.user()) {
      $scope.newSpout.owner = Meteor.user()._id;
      Spouts.insert($scope.newSpout);
      $scope.newSpout = undefined;
      $ionicScrollDelegate.resize();
    }
  };
                  
  $scope.remove = function(spout) {
    if (spout.owner === Meteor.userId()._id){
      Spouts.remove({_id:spout.id});
      $ionicScrollDelegate.resize();
    } else {
      console.log('nope')
    }
  };
});