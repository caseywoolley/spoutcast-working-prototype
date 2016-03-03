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
  }

  $scope.setVideo = function(){
    $scope.review.video = true;
    $scope.update($scope.review._id, {video: true});
  };

  $rootScope.triggerRelink = function() {
    console.log('broadcast')
    $rootScope.$broadcast('reload-video');
  };

  $scope.reloadVideo = function(){ 
    console.log('reload')
    $rootScope.triggerRelink();
  };

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

  $scope.$on('video-loaded', function(el) { console.log('el', el); });

  $scope.getThumbnail = function(callback){
    //example - http://jsfiddle.net/giu_do/e98tffu6/
    var canvas = document.getElementById('canvas');
    var video = document.getElementById($scope.review._id + 'hidden');

    console.log('video found', video)

    video.onloadeddata = function () {
      console.log('video frame loaded')
      // do something
    

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      var url = canvas.toDataURL('image/jpeg');
      if (callback) {
        callback(url)
      }

      // console.log('url', url)
      canvas.toBlob(function(blob){
        console.log(blob)



        $cordovaFile.writeFile(cordova.file.syncedDataDirectory + 'media/', $scope.review._id + '.jpg', blob, true)
        .then(function (success) {
          // success
          console.log('thumb', success)
          $scope.review.poster = true;
          $scope.update($scope.review._id, {poster: true});
        }, function (error) {
          // error
          console.log('error', error)
        });

        if (callback) {
          //callback(blob);
        }
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
      // $scope.$apply(function(){
      //   $scope.uploading = true;
      // });
      console.log(mediaFiles[0]);
      var path = '/local-filesystem' + mediaFiles[0].fullPath;

      //move file 
      var pathParts = mediaFiles[0].fullPath.split("/");
      pathParts.pop();
      var fromPath = 'file://' + pathParts.join('/');
      var toPath = cordova.file.syncedDataDirectory + 'media/';
      console.log('from', fromPath)
      console.log('to', toPath)
      $cordovaFile.createDir(cordova.file.syncedDataDirectory, 'media', false)
        .then(function(dir){ console.log('Created ', dir);}, 
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

        //generate thumbnail
        // $scope.getThumbnail(function(file){
        //   console.log(file)
        //   $cordovaFile.writeFile(cordova.file.syncedDataDirectory, $scope.review._id + '.jpg', file, true)
        //   .then(function (success) {
        //     // success
        //     console.log('success', success)
        //   }, function (error) {
        //     // error
        //     console.log('error', error)
        //   });
        // });



      //vid preview
      // var v = '<video id="video-preview" play-toggle preload="auto" style="height:300px;width:100%" poster="http://placehold.it/480x360" controls>';
      // v += '<source src="' + path + '#t=0.01' + '" type="video/quicktime">';
      // v += '</video> <spout-box spout="newSpout"></spout-box>';
      // document.querySelector(".video-preview").innerHTML = v;
      
      //$scope.newSpout.video = path;

      // getBlobURL(path, mediaFiles[0].type, function(url, blob) {
      //   $scope.uploadVideo(blob);

      //   // $scope.$apply(function(){
      //   //     $scope.uploaded = true;
      //   //     $scope.uploading = false;
      //   //   });

      // });
    };

    $scope.uploadVideo = function(path, mime){
      $scope.$apply(function(){
        $scope.uploading = true;
      });
      getBlobURL(path, mime, function(url, file) {
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

          $scope.review.active = true;
          $scope.update($scope.review._id, {active: true});

          $scope.$apply(function(){
            $scope.uploaded = true;
            $scope.uploading = false;
          });

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

    $scope.update = function(id, updates) {
      // if ($scope.review.user_id === Meteor.userId()._id) {
        // var id = update._id;
        // delete update._id;
        Reviews.update({_id: id }, {$set: updates});
      // }
    };

    $scope.publish = function(review) {
      console.log('review', review)
      console.log('video', $scope.localPath + review._id + '.mov')
    };

  // $scope.save = function() {
  //   if($scope.form.$valid) {
  //     delete $scope.review._id;
  //     Reviews.update({
  //       _id: $stateParams.reviewId
  //     }, {
  //       $set: $scope.review
  //     }, function(error) {
  //       if(error) {
  //         console.log('Unable to update the review'); 
  //       } else {
  //         console.log('Done!');
  //       }
  //     });
  //   }
  // };
        
  // $scope.reset = function() {
  //   $scope.review.reset();
  // };
});