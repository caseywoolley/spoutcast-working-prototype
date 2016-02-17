'use strict'

angular.module('spoutCastApp')
  .controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, $window) {

    $scope.newSpout = {};
    $scope.uploading = false;
    $scope.uploader = new Slingshot.Upload("uploadToAmazonS3");

    var getBlobURL = function(url, mime, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.responseType = "arraybuffer";

      xhr.addEventListener("load", function() {
        var arrayBufferView = new Uint8Array(this.response);
        var blob = new Blob([arrayBufferView], {
          type: mime
        });
        var url = window.URL.createObjectURL(blob);

        callback(url, blob);
      });
      xhr.send();
    };

    var captureError = function(error) {
      navigator.notification.alert('ERROR:' + error.message, null, "Capture Error");
    };

    var captureSuccess = function(mediaFiles) {
      $scope.$apply(function(){
        $scope.uploading = true;
      });
      console.log(mediaFiles[0]);
      var path = '/local-filesystem' + mediaFiles[0].fullPath;

      getBlobURL(path, mediaFiles[0].type, function(url, blob) {
        $scope.uploader.send(blob, function(error, downloadUrl) {
          
          if (error) {
            console.error('Error uploading', $scope.uploader.xhr.response);
            //TODO: add error popup
          } else {
            console.log(downloadUrl)
            $scope.newSpout.video = downloadUrl;

            var v = "<video style='height:300px;width:100%' poster='http://placehold.it/480x360' controls>";
            v += "<source src='" + downloadUrl + "' type='video/quicktime'>";
            v += "</video>";
            document.querySelector(".video-preview").innerHTML = v;
          }
          $scope.$apply(function(){
            $scope.uploading = false;
          });
        });
      });

    };

    $scope.recordSpout = function() {
      // $scope.uploading = true;


      if (Meteor.isCordova) {
        console.log('using mobile device');
        navigator.device.capture.captureVideo(captureSuccess, captureError, {
          limit: 1,
          quality: 1,
          duration: 15
        });
      } else {
        console.log('using a browser');
        MeteorCamera.getPicture({}, function(data) {
          console.log(data)
        });
      }
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
      if (Meteor.user()) {
        $scope.newSpout.owner = Meteor.user()._id;
        Spouts.insert($scope.newSpout);
        $scope.newSpout = {};
        //$ionicScrollDelegate.resize();
      }
    };

    $scope.remove = function(spout) {
      if (spout.owner === Meteor.userId()._id) {
        Spouts.remove({
          _id: spout.id
        });
        $ionicScrollDelegate.resize();
      } else {
        console.log('nope')
      }
    };
  });
