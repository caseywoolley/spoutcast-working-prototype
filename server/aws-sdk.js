// AWS.config.update({
//    accessKeyId: Meteor.settings.private.amazonS3.AWSAccessKeyId,
//    secretAccessKey: Meteor.settings.private.amazonS3.AWSSecretAccessKey
// });

// var s3 = new AWS.S3();
//    var params = {
//    Bucket: Meteor.settings.private.amazonS3.AWSBucket,
//    Key: data.Key
// };

// var deleteObject = Meteor.wrapAsync(
//    s3.deleteObject(params, function(error, data) {
//       if(error) {
//          console.log(error);
//       } else {
//          console.log(data);
//       }
//    })
// );
AWS.config.update({
  accessKeyId:  Meteor.settings.private.amazonS3.AWSAccessKeyId,
  secretAccessKey: Meteor.settings.private.amazonS3.AWSSecretAccessKey,
});

Meteor.methods({
  'removeAWSMedia': function (key){
  	console.log('aws remove', key)
    var currentUserId = Meteor.userId();
    // var currentPhoto = Files.findOne( { '_id': selectedPhoto, 'userId': currentUserId }, { fields: { 'url': 1 } } );

    var bucket = Meteor.settings.public.amazonS3.AWSBucket;
    console.log('bucket', bucket)

    // var mediaKeys = {
    // 	video: review.user_id + '/' + review._id + '.mov',
    // 	poster: review.user_id + '/' + review._id + '.jpg',
    // 	avatar: currentUserId + '/avatar.jpg'
    // };

    //https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/HWWWzSPCEodfCMtXk/7kLH2NEd9t3kuQC2d.mov

    var s3 = new AWS.S3();
    var params = {
      Bucket: 'spoutcast-contentdelivery-mobilehub-1722871942', // 'mybucket'
      Key: key // 'images/myimage.jpg'
    };

    var deleteObject = Meteor.wrapAsync(
      s3.deleteObject(params, function (error, data) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(data);
        }
      })
    );
    // Remove the entry in the database. (Want to only trigger this if there is no error from Amazon).
    // Files.remove({_id: selectedPhoto, userId: currentUserId});
  }
});