Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: "spoutcast-contentdelivery-mobilehub-1722871942",
  AWSAccessKeyId: Meteor.settings.AWSAccessKeyId,
  AWSSecretAccessKey: Meteor.settings.AWSSecretAccessKey,
  region: "us-east-1",
  acl: "public-read",
  authorize: function () {
    //Deny uploads if user is not logged in.
    // if (!this.userId) {
    //   var message = "Please login before posting files";
    //   throw new Meteor.Error("Login Required", message);
    // }
    return true;
  },
  key: function ( file ) {
    var user = Meteor.users.findOne( this.userId );
    // return user.emails[0].address + "/" + file.name;
    // return file.name;
    //console.log(userId)
    //Mongo-ish Id - https://gist.github.com/solenoid/1372386
    var mongoObjectId = function () {
      var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
      return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
          return (Math.random() * 16 | 0).toString(16);
      }).toLowerCase();
    };

    //userId/vidId
    return this.userId + '/' + mongoObjectId() + '.mov';
  }
});