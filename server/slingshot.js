Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: "spoutcast-contentdelivery-mobilehub-1722871942",
  AWSAccessKeyId: Meteor.settings.private.AWSAccessKeyId,
  AWSSecretAccessKey: Meteor.settings.private.AWSSecretAccessKey,
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
    //Mongo-ish Id - https://gist.github.com/solenoid/1372386
    // var mongoObjectId = function () {
    //   var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    //   return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
    //       return (Math.random() * 16 | 0).toString(16);
    //   }).toLowerCase();
    // };

    // var extensions = {
    //   'image/png': 'png',
    //   'image/jpeg': 'jpg',
    //   'video/quicktime': 'mov'
    // };
    console.log(file);
    //userId/vidId
    // return this.userId + '/' + (file.name || mongoObjectId()) + '.' + extensions[file.type];
    return this.userId + '/' + file.name;
  }
});