Reviews = new Mongo.Collection('reviews');

Reviews.allow({
  insert: function(userId, review) {
    return !!userId;
  },
  update: function(userId, review, fields, modifier) {
  	//TODO: deny attempts to modify geo-location & associated location
    return !!userId;
  },
  remove: function(userId, review) {
    return !!userId;
  }
});