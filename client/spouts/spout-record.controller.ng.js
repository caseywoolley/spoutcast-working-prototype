'use strict'

angular.module('spoutCastApp')
  .controller('SpoutRecordCtrl', function($scope, $ionicScrollDelegate, $ionicListDelegate, $window, GeoService) {

    $scope.newSpout = {};
    $scope.uploading = false;
    $scope.uploaded = false;
    $scope.uploader = new Slingshot.Upload("uploadToAmazonS3");
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

    //$scope.newSpout.location = $scope.currentLocation; 

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
            $scope.newSpout.video = downloadUrl.split("/").pop();

            var v = '<video style="height:300px;width:100%" poster="http://placehold.it/480x360" controls>';
            v += '<source src="' + $scope.awsBucket + Meteor.user()._id + '/' + $scope.newSpout.video + '" type="video/quicktime">';
            v += '</video>';
            document.querySelector(".video-preview").innerHTML = v;
          }
          $scope.$apply(function(){
            $scope.uploaded = true;
            $scope.uploading = false;
          });
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
        console.log(location)
        if (location) {
          $scope.newSpout.location = {};
          $scope.newSpout.location.latitude = location.latitude;
          $scope.newSpout.location.longitude = location.longitude;
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
