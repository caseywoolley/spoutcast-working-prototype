Reviews = new Mongo.Collection('reviews');

Reviews.allow({
  insert: function(userId, review) {
    return !!userId;
  },
  update: function(userId, review, fields, modifier) {
  	//TODO: deny attempts to modify geo-location & associated location
    return review.user_id === userId;
  },
  remove: function(userId, review) {
    return review.user_id === userId;
  }
});

if (Meteor.isServer) {
  Reviews._ensureIndex({'reviews.loc.coordinates':'2dsphere'});
};