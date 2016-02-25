'use strict'

angular.module('spoutCastApp')
  .controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, $window, GeoService) {

    $scope.newSpout = {};
    $scope.uploading = false;
    $scope.uploaded = false;
    $scope.uploader = new Slingshot.Upload("uploadToAmazonS3");
    $scope.uploadThumb = new Slingshot.Upload("uploadToAmazonS3");
    $scope.awsBucket = 'https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/';
    $scope.getUser = Meteor.user;
    

    $scope.getCoords = function(){
      return Geolocation.latLng();
    };

    $scope.autorun(function(){
      var coords = $scope.getCoords();
      GeoService.getLocation(coords, function(data){
        $scope.address = data.address;
        $scope.$apply();
      });
    });

    $scope.getThumbnail = function(callback){
      //example - http://jsfiddle.net/giu_do/e98tffu6/
      var canvas = document.getElementById('canvas');
      var video = document.getElementById('video-preview');
      //get 4:3 thumbnail
      var ratio = 4/3;
      var width = video.videoWidth;
      var height = video.videoHeight;
      var origin = [0,0];
      
      if (width > height) {
        width = height * ratio;
        origin[0] = (video.videoWidth - width) / 2;
      } else {
        height = width / ratio;
        origin[1] = (video.videoHeight - height) / 2;
      }
      
      // canvas.height = height;
      // canvas.width = width;
      // canvas.getContext('2d').drawImage(video, origin[0], origin[1], width, height, 0, 0, width, height);
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // console.log('url',canvas.toDataURL("image/png"));
      // console.log('canvas',canvas);
      
      // var v = '<img src="'+ canvas.toDataURL("image/png") +'">';
      // document.querySelector(".download").innerHTML = v;
      // return canvas.toDataURL("image/png");
      canvas.toBlob(function(blob){
        console.log('blob', blob)
        callback(blob);
      },"image/jpeg", 0.95);
      // var blob = b64toBlob(canvas.toDataURL("image/png"), "image/png");
      // console.log(blob)
      // return blob;
    };

    //from - http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    // var b64toBlob = function(b64Data, contentType, sliceSize) {
    //   contentType = contentType || '';
    //   sliceSize = sliceSize || 512;

    //   var byteCharacters = atob(b64Data);
    //   var byteArrays = [];

    //   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //       var slice = byteCharacters.slice(offset, offset + sliceSize);

    //       var byteNumbers = new Array(slice.length);
    //       for (var i = 0; i < slice.length; i++) {
    //           byteNumbers[i] = slice.charCodeAt(i);
    //       }

    //       var byteArray = new Uint8Array(byteNumbers);

    //       byteArrays.push(byteArray);
    //   }

    //   var blob = new Blob(byteArrays, {type: contentType});
    //   return blob;
    // };

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

      //vid preview
      var v = '<video id="video-preview" play-toggle preload="auto" style="height:300px;width:100%" poster="http://placehold.it/480x360" controls>';
      v += '<source src="' + path + '#t=0.01' + '" type="video/quicktime">';
      v += '</video>';
      document.querySelector(".video-preview").innerHTML = v;
      $scope.newSpout.video = path;

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

            // var v = '<video style="height:300px;width:100%" poster="http://placehold.it/480x360" controls>';
            // v += '<source src="' + $scope.awsBucket + Meteor.user()._id + '/' + $scope.newSpout.video + '#t=0.01' + '" type="video/quicktime">';
            // v += '</video>';
            // document.querySelector(".video-preview").innerHTML = v;
          }
          $scope.$apply(function(){
            $scope.uploaded = true;
            $scope.uploading = false;
          });
        });
    };

    $scope.recordSpout = function() {
      if (Meteor.user()) {
        // $scope.uploading = true;
        // $scope.save(function(err, data){
        //   $scope.spoutId = data;
        //   console.log('saved', data);
        // });

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
      console.log('save')
      //callback = callback || function(){return;};
      if (Meteor.user()) {
        // $scope.newSpout.location = {};
        // $scope.newSpout.location.latitude = $scope.currentLocation.lat;
        // $scope.newSpout.location.longitude = $scope.currentLocation.lng;

        // GeoService.getLocation(function(location){
        //   if (err){ 
        //     console.log(err);
        //     return;
        //   }
        var location = Session.get('location');
        location = true;
        console.log(location)
        if (location) {
          // $scope.newSpout.location = {};
          // $scope.newSpout.location.latitude = location.latitude;
          // $scope.newSpout.location.longitude = location.longitude;
          $scope.newSpout.owner = Meteor.user()._id;
          // $scope.newSpout.active = true;
          Spouts.insert($scope.newSpout);
          $scope.newSpout = {};
          $scope.uploaded = false;
        }
        // });
      }
    };


    // $scope.update = function(id, spout) {
    //   if (spout.owner === Meteor.userId()._id) {
    //     Spouts.update(id, {$set: spout});
    //   }
    // };


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
