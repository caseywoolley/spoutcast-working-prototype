'use strict'

angular.module('spoutCastApp')
.controller('ReviewDetailCtrl', function($scope, $rootScope, $stateParams, $cordovaFile) {
  
  $scope.awsBucket = Meteor.settings.public.AWSBucket;
  $scope.uploader = new Slingshot.Upload("uploadToAmazonS3");
  $scope.uploadThumb = new Slingshot.Upload("uploadToAmazonS3");
  $scope.uploading = false;
  $scope.uploaded = false;


  $scope.helpers({
    review: function() {
      return Reviews.findOne({ _id: $stateParams.id }); 
    },
    location: function() {
      return Locations.findOne({ _id: $scope.review.location_id }); 
    }
  });
  
  $scope.subscribe('reviews');
  $scope.subscribe('locations');

  if (Meteor.isCordova) {
    $scope.localPath = '/local-filesystem' + cordova.file.syncedDataDirectory.slice(7) + 'media/';
    $scope.mediaFolder = cordova.file.syncedDataDirectory + 'media/';
    $scope.vidFile = $scope.review._id + '.mov';
    $scope.thumbFile = $scope.review._id + '.jpg';
  }

  $scope.checkFile = function(folder, file) {
    var filePath = cordova.file.syncedDataDirectory + folder + '/';
    $cordovaFile.checkFile(filePath , file)
      .then(function(file){ 
        console.log('File Found ', file);
      }, 
      function(err){ 
        console.log('No file found');
      });
  };

  $scope.deleteFile = function(folder, file) {
    $cordovaFile.removeFile(folder , file)
      .then(function(file){ 
        console.log('File deleted', file);
      }, 
      function(err){ 
        console.log('Error deleting file:', err);
      });
  };

  $scope.getThumbnail = function(){
    //example - http://jsfiddle.net/giu_do/e98tffu6/
    var canvas = document.getElementById('canvas');
    var video = document.getElementById($scope.review._id + 'hidden');
    
    video.onloadeddata = function () {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob(function(blob){
        $cordovaFile.writeFile(cordova.file.syncedDataDirectory + 'media/', $scope.review._id + '.jpg', blob, true)
        .then(function (success) {
          console.log('thumbnail generated', success)
          $scope.review.poster = true;
          $scope.update($scope.review._id, {poster: true});
        }, function (error) {
          console.log('error', error)
        });
      },"image/jpeg", 0.75); //75% quality jpg
    };
  };

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
      console.log(mediaFiles[0]);
      var path = '/local-filesystem' + mediaFiles[0].fullPath;

      //move captured video 
      var fromPath = 'file://' + mediaFiles[0].fullPath.split("/").slice(0, -1).join('/');
      var toPath = cordova.file.syncedDataDirectory + 'media/';
      $cordovaFile.createDir(cordova.file.syncedDataDirectory, 'media', false)
        .then(function(dir){ console.log('Created media directory ', dir);}, 
              function(err){ console.log('Directory already exists');});

      $cordovaFile.moveFile(fromPath, mediaFiles[0].name, toPath, $scope.review._id + '.mov')
        .then(function(movedFile){
          console.log('movedFile', movedFile);
          path = cordova.file.syncedDataDirectory + 'media/' + movedFile.name;
          console.log('review',$scope.review)
          
          $scope.review.video = true;
          $scope.update($scope.review._id, {video: true});
          // $scope.getThumbnail();
        }, function(err){
          console.log('err', err);
        });

        console.log('moved path', path)

    };

    $scope.makeBlob = function() {

    };

    var uploadSuccess = function(){
      console.log('upload success!')

      $scope.review.active = true;
      $scope.update($scope.review._id, {active: true});
      $scope.uploading = false;
      $scope.deleteFile($scope.mediaFolder, $scope.vidFile);
      $scope.deleteFile($scope.mediaFolder, $scope.thumbFile);
    };

    $scope.publish = function(){
      $scope.uploading = true;
      
      var vidUploaded = false;
      var thumbUploaded = false;

      //upload thumbnail
      $cordovaFile.readAsArrayBuffer($scope.mediaFolder, $scope.thumbFile)
      .then(function (arraybuffer) {
        var blob = new Blob([new Uint8Array(arraybuffer)], {type: 'image/jpeg'});
        blob.name = $scope.thumbFile;

        $scope.uploadThumb.send(blob, function(error, downloadUrl) { 
          if (error) {
            $scope.uploading = false;
            console.error('Error uploading', $scope.uploader.xhr.response);
            //TODO: add error popup
          } else {
            console.log(downloadUrl)  
            thumbUploaded = true;
            if (vidUploaded) { uploadSuccess(); }
          }
        });
      }, function (error) {
        console.log(error)
      });

      //upload video
      $cordovaFile.readAsArrayBuffer($scope.mediaFolder, $scope.vidFile)
      .then(function (arraybuffer) {
        var blob = new Blob([new Uint8Array(arraybuffer)], {type: 'video/quicktime'});
        blob.name = $scope.vidFile;

        $scope.uploader.send(blob, function(error, downloadUrl) { 
          if (error) {
            $scope.uploading = false;
            console.error('Error uploading', $scope.uploader.xhr.response);
            //TODO: add error popup
          } else {
            console.log(downloadUrl)  
            vidUploaded = true;
            if (thumbUploaded) { uploadSuccess(); }
          }
        });

      }, function (error) {
        console.log(error)
      });
    };

    $scope.recordVideo = function() {
      if (Meteor.user()) {
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
      } else {
        console.log('not logged in');
      }
    };


    $scope.update = function(id, updates) {
      if ($scope.review.user_id === Meteor.userId()) {
        Reviews.update({_id: id }, {$set: updates});
      }
    };

  
});