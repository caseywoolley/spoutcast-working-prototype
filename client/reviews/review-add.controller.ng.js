'use strict'

angular.module('spoutCastApp')
.controller('ReviewAddCtrl', function($scope, ReviewService, GeoService) {
  
  $scope.review = ReviewService.getCurrentReview();
  $scope.awsBucket = Meteor.settings.public.AWSBucket;
  $scope.uploading = false;
  $scope.uploaded = false;
  $scope.uploader = new Slingshot.Upload("uploadToAmazonS3");
  $scope.uploadThumb = new Slingshot.Upload("uploadToAmazonS3");

  // $scope.helpers({
  //   review: function() {
  //     return Reviews.findOne({ _id: $scope.review.location }); 
  //   },
  //   location: function() {
  //     return Locations.findOne({ _id: $scope.review.location }); 
  //   }
  // });
  
  // $scope.subscribe('reviews');
  // $scope.subscribe('locations');

  // $scope.autorun(function() {
  //   $scope.latLng = Geolocation.latLng();

  //   GeoService.getAddress($scope.latLng, function(data){
  //     $scope.$apply(function(){
  //       $scope.address = data.address;
  //     });
  //   }); 
  // });

  $scope.getThumbnail = function(callback){
    //example - http://jsfiddle.net/giu_do/e98tffu6/
    var canvas = document.getElementById('canvas');
    var video = document.getElementById('video-preview');

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(function(blob){
      callback(blob);
    },"image/jpeg", 0.95); //95% quality jpg
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
      // $scope.$apply(function(){
      //   $scope.uploading = true;
      // });
      console.log(mediaFiles[0]);
      var path = '/local-filesystem' + mediaFiles[0].fullPath;

      //move file 
      var pathParts = mediaFiles[0].fullPath.split("/");
      pathParts.pop();
      var origPath = 'file://' + pathParts.join('/');
      console.log('from', origPath)
      console.log('to', cordova.file.syncedDataDirectory + 'media/')
      $cordovaFile.createDir(cordova.file.syncedDataDirectory, 'media', false)
        .then(function(dir){
          console.log('dir', dir);
        }, function(err){
          console.log('err', err);
        });
      $cordovaFile.moveFile(origPath, mediaFiles[0].name, cordova.file.syncedDataDirectory + 'media/', mediaFiles[0].name)
        .then(function(movedFile){
          console.log('movedFile', movedFile);
          path = cordova.file.syncedDataDirectory + 'media/' + movedFile.name;
        }, function(err){
          console.log('err', err);
        });
      console.log('moved path', path)
      //vid preview
      var v = '<video id="video-preview" play-toggle preload="auto" style="height:300px;width:100%" poster="http://placehold.it/480x360" controls>';
      v += '<source src="' + path + '#t=0.01' + '" type="video/quicktime">';
      v += '</video> <spout-box spout="newSpout"></spout-box>';
      document.querySelector(".video-preview").innerHTML = v;
      
      //$scope.newSpout.video = path;
      //TODO: move tmp video file to a storage location for drafts

      getBlobURL(path, mediaFiles[0].type, function(url, blob) {
        $scope.uploadVideo(blob);

        // $scope.$apply(function(){
        //     $scope.uploaded = true;
        //     $scope.uploading = false;
        //   });

      });
    };

    $scope.uploadVideo = function(file){
      $scope.$apply(function(){
        $scope.uploading = true;
      });
      $scope.uploader.send(file, function(error, downloadUrl) { 
          if (error) {
            console.error('Error uploading', $scope.uploader.xhr.response);
            //TODO: add error popup
          } else {
            console.log(downloadUrl)
            // $scope.newSpout.video = downloadUrl.split("/").pop();
            var fileName = downloadUrl.split("/").pop();
            $scope.newSpout.video = fileName.split('.')[0];

            //upload thumbnail
            $scope.getThumbnail(function(thumb){
              thumb.name = $scope.newSpout.video;
              $scope.uploadThumb.send(thumb, function(error, downloadUrl) {
                if (error){
                  console.error('Error uploading', $scope.uploadThumb.xhr.response);
                } else {
                  console.log('thumb', downloadUrl)
                }
              });
            });
          }
          $scope.$apply(function(){
            $scope.uploaded = true;
            $scope.uploading = false;
          });
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

  $scope.checkin = function(){

  };

  $scope.save = function(review) {
    console.log('save')
    if (review && review.owner === Meteor.user()._id){

      Reviews.insert(review, function(err, result){
        if (err){
          console.log(err);
        } else {
          console.log('added', result)
        }
      });
    }
  };

  $scope.save($scope.review);
  
  // $scope.save = function() {
  //   if($scope.form.$valid) {
  //     delete $scope.location._id;
  //     Locations.update({
  //       _id: $stateParams.locationId
  //     }, {
  //       $set: $scope.location
  //     }, function(error) {
  //       if(error) {
  //         console.log('Unable to update the location'); 
  //       } else {
  //         console.log('Done!');
  //       }
  //     });
  //   }
  // };
        
  // $scope.reset = function() {
  //   $scope.location.reset();
  // };
});