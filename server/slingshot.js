Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: "spoutcast-contentdelivery-mobilehub-1722871942",
  AWSAccessKeyId: Meteor.settings.private.amazonS3.AWSAccessKeyId,
  AWSSecretAccessKey: Meteor.settings.private.amazonS3.AWSSecretAccessKey,
  region: "us-east-1",
  acl: "public-read",
  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }
    return !!this.userId;
  },
  key: function ( file ) {
    var user = Meteor.users.findOne( this.userId );
    return this.userId + '/' + file.name;
  }
});