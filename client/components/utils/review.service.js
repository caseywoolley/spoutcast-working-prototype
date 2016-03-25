'use strict'

angular.module('spoutCastApp')
.service('ReviewService', function($cordovaFile, $meteor) {

  var review;
  var vidFile;
  var thumbFile;
  var awsBucket = Meteor.settings.public.amazonS3.AWSBucket;
  var uploader = new Slingshot.Upload("uploadToAmazonS3");
  var uploadThumb = new Slingshot.Upload("uploadToAmazonS3");


  if (Meteor.isCordova) {
    var localPath = '/local-filesystem' + cordova.file.syncedDataDirectory.slice(7) + 'media/';
    var mediaFolder = cordova.file.syncedDataDirectory + 'media/';
  }

  var setReview = function(newReview) {
    review = newReview;
    vidFile = review._id + '.mov';
    thumbFile = review._id + '.jpg';
  };

  var deleteFile = function(folder, file) {
    $cordovaFile.removeFile(folder , file)
      .then(function(file){ 
        console.log('File deleted', file);
      }, 
      function(err){ 
        console.log('Error deleting file:', err);
      });
  };

  // TODO: create a directive to get the blob?
  // $scope.getThumbnail = function(canvasId){
  //   //example - http://jsfiddle.net/giu_do/e98tffu6/
  //   var canvas = document.getElementById(canvasId);
  //   var video = document.getElementById($scope.review._id + 'hidden');
    
  //   video.onloadeddata = function () {
  //     canvas.height = video.videoHeight;
  //     canvas.width = video.videoWidth;
  //     canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
  //     canvas.toBlob(function(blob){
  //       $cordovaFile.writeFile(cordova.file.syncedDataDirectory + 'media/', $scope.review._id + '.jpg', blob, true)
  //       .then(function (success) {
  //         console.log('thumbnail generated', success)
  //         $scope.review.poster = true;
  //         $scope.update($scope.review, {poster: true});
  //       }, function (error) {
  //         console.log('error', error)
  //       });
  //     },"image/jpeg", 0.75); //75% quality jpg
  //   };
  // };

  var captureError = function(error) {
    navigator.notification.alert('ERROR:' + error.message, null, "Capture Error");
  };

  var captureSuccess = function(mediaFiles) {
    console.log(mediaFiles[0]);
    //move captured video 
    var fromPath = 'file://' + mediaFiles[0].fullPath.split("/").slice(0, -1).join('/');
    var toPath = cordova.file.syncedDataDirectory + 'media/';
    $cordovaFile.createDir(cordova.file.syncedDataDirectory, 'media', false)
      .then(function(dir){ console.log('Created media directory ', dir);}, 
            function(err){ console.log('Directory already created');});

    $cordovaFile.moveFile(fromPath, mediaFiles[0].name, toPath, $scope.vidFile)
      .then(function(movedFile){
        review.video = true;
        update(review, {video: true});
      }, function(err){
        console.log('Error moving file:', err);
      });
  };


  var uploadSuccess = function(){
    console.log('upload success!')

    review.active = true;
    review.published = Date.now();
    update(review, {active: true, published: review.published});
    uploading = false;
    deleteFile(mediaFolder, vidFile);
    deleteFile(mediaFolder, thumbFile);
  };

  var publish = function(){
    // $scope.uploading = true;
    
    var vidUploaded = false;
    var thumbUploaded = false;

    //upload thumbnail
    $cordovaFile.readAsArrayBuffer(mediaFolder, thumbFile)
    .then(function (arraybuffer) {
      var blob = new Blob([new Uint8Array(arraybuffer)], {type: 'image/jpeg'});
      blob.name = thumbFile;

      uploadThumb.send(blob, function(error, downloadUrl) { 
        if (error) {
          uploading = false;
          console.error('Error uploading', uploader.xhr.response);
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
    $cordovaFile.readAsArrayBuffer(mediaFolder, vidFile)
    .then(function (arraybuffer) {
      var blob = new Blob([new Uint8Array(arraybuffer)], {type: 'video/quicktime'});
      blob.name = vidFile;

      uploader.send(blob, function(error, downloadUrl) { 
        if (error) {
          // uploading = false;
          console.error('Error uploading', uploader.xhr.response);
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

  var recordVideo = function() {
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


  var update = function(review, updates) {
    if (review.user_id === Meteor.userId()) {
      Reviews.update({_id: review._id }, {$set: updates});
    }
  };

  //TODO: merge with removeGroup function
  var remove = function(review) {
    if (review.video) {
      if (review.active) {
        $meteor.call('removeAWSMedia', review.user_id + '/' + review._id + '.mov');
        $meteor.call('removeAWSMedia', review.user_id + '/' + review._id + '.jpg');
      } else {
        deleteFile(mediaFolder, vidFile);
        deleteFile(mediaFolder, thumbFile);
      }
    }
    Reviews.remove({_id:review._id});
  };

  var removeGroup = function(reviews) {
    var AWSkeys = [];
    for (var i = 0; i < reviews.length; i ++) {
      var review = reviews[i];
      if (review.video) {
        if (review.active) {
          AWSkeys.push(review.user_id + '/' + review._id + '.mov');
          AWSkeys.push(review.user_id + '/' + review._id + '.jpg');
        } else {
          deleteFile(mediaFolder, review._id + '.mov');
          deleteFile(mediaFolder, review._id + '.jpg');
        }
      }
    }
    if (AWSkeys.length > 0) { $meteor.call('removeAWSMedia', AWSkeys); }
    // Reviews.remove(selection);
    $meteor.call('removeUserReviews');
  };

  return {
    remove: remove,
    removeGroup: removeGroup
  };


});