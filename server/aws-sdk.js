AWS.config.update({
  accessKeyId:  Meteor.settings.private.amazonS3.AWSAccessKeyId,
  secretAccessKey: Meteor.settings.private.amazonS3.AWSSecretAccessKey,
});

Meteor.methods({
  'removeAWSMedia': function (keys){
  	console.log('aws remove', keys)
    var currentUserId = Meteor.userId();
    var bucket = Meteor.settings.public.amazonS3.AWSBucket;
    console.log('bucket', bucket)
    //https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/HWWWzSPCEodfCMtXk/7kLH2NEd9t3kuQC2d.mov

    var s3 = new AWS.S3();
    var params = {
      Bucket: 'spoutcast-contentdelivery-mobilehub-1722871942', // 'mybucket'
      Key: '' // 'images/myimage.jpg'
    };
    var key;

    for (var i = 0; i < keys.length; i++) { 
      params.Key = keys[i];
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
    }
  },
});