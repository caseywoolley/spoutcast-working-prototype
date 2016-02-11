'use strict'

angular.module('spoutCastApp')
.controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, $window) {

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.recordSpout = function(){
    if (Meteor.isCordova){
      console.log("device capability: " + JSON.stringify(navigator.device.capture));
      navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1, duration: 13});
    } else {
      console.log('using a browser')
      MeteorCamera.getPicture({}, function(data){
        console.log(data)
      });
      // do the standard mdg:camera thing here ??
      // because we're in a browser.....
    }

    var captureError = function(error) {
      navigator.notification.alert('ERROR:' + error.message, null, "Capture Error");
    }

    var captureSuccess = function(mediaFiles) {
      var i, path, len;
      for (i=0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        // do something with this file... upload to S3 ?
        console.log("path = " + path);
      }
    };
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