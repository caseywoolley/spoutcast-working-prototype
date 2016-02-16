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
    // var user = Meteor.users.findOne( this.userId );
    // return user.emails[0].address + "/" + file.name;
    // return file.name;
    function makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    return makeid() + '.mov'; 
  }
});