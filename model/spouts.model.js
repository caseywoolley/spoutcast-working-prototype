Spouts = new Mongo.Collection('spouts');

Spouts.allow({
  insert: function(userId, spout) {
    return !!userId;
  },
  update: function(userId, spout, fields, modifier) {
    return userId === spout.owner;
  },
  remove: function(userId, spout) {
    return userId === spout.owner;
  }
});