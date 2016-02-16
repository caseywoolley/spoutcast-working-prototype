'use strict'

angular.module('spoutCastApp')
.controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, $window) {

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  $scope.awsUrl = 'http://www.w3schools.com/html/mov_bbb.mp4';

  var uploader = new Slingshot.Upload("uploadToAmazonS3");

  $scope.recordSpout = function(){

    var captureError = function(error) {
      navigator.notification.alert('ERROR:' + error.message, null, "Capture Error");
    };

    var captureSuccess = function(mediaFiles) {
      var i, path, len;
      for (i=0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        console.log("path = " + path);

      }
        //slingshot - upload to AWS
        console.log('file', mediaFiles[0])
        
        var file = '/local-filesystem' + mediaFiles[0].fullPath;
        // var file = mediaFiles[0].localURL;
        console.log('path', file) 
        //mediaFiles[0].fullPath = file;
        //console.log('path', file)


        var getBlobURL = function(url, mime, callback) {
          var xhr = new XMLHttpRequest();
          xhr.open("get", url);
          xhr.responseType = "arraybuffer";

          xhr.addEventListener("load", function() {
            var arrayBufferView = new Uint8Array( this.response );
            var blob = new Blob( [ arrayBufferView ], { type: mime } );
            var url = window.URL.createObjectURL(blob);

            callback(url, blob);
          });
          xhr.send();
        };



        getBlobURL(file, "video/quicktime", function(url, blob){
          console.log(url)
          console.log(blob) 
            uploader.send(blob, function (error, downloadUrl) {
              if (error) {
                // Log service detailed response.
                console.error('Error uploading', uploader.xhr.response);
                alert (error);
              } else {
              
              console.log(downloadUrl)

                var v = "<video controls='controls'>";
                v += "<source src='" + url + "' type='video/mov'>";
                v += "</video>";
                document.querySelector(".video-area").innerHTML = v;

                $scope.awsUrl = downloadUrl;
              }
            });
          });


        // uploader.send(mediaFiles[0], function (error, downloadUrl) {
        //   if (error) {
        //     // Log service detailed response. 
        //     console.error('Error uploading', uploader.xhr.response);
        //     alert (error);
        //   }
        //   else {
        //     //Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        //     console.log(downloadUrl)

        //     var v = "<video controls='controls'>";
        //     v += "<source src='" + file + "' type='video/mov'>";
        //     v += "</video>";
        //     document.querySelector(".video-area").innerHTML = v;

        //     $scope.awsUrl = downloadUrl;
        //   }
        // });
    };

    if (Meteor.isCordova){
      console.log('using mobile device')
      navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1, duration: 15});
    } else {
      console.log('using a browser')
      MeteorCamera.getPicture({}, function(data){
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