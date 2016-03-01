Locations = new Mongo.Collection('locations');

Locations.allow({
  insert: function(userId, location) {
    return true;
  },
  update: function(userId, location, fields, modifier) {
    return true;
  },
  remove: function(userId, location) {
    return true;
  }
});