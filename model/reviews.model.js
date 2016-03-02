Reviews = new Mongo.Collection('reviews');

Reviews.allow({
  insert: function(userId, review) {
    return true;
  },
  update: function(userId, review, fields, modifier) {
    return true;
  },
  remove: function(userId, review) {
    return true;
  }
});