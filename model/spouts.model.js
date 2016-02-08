Spouts = new Mongo.Collection('spouts');

Spouts.allow({
  insert: function(userId, spout) {
    return true;
  },
  update: function(userId, spout, fields, modifier) {
    return true;
  },
  remove: function(userId, spout) {
    return true;
  }
});