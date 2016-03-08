Locations = new Mongo.Collection('locations');

Locations.allow({
  insert: function(userId, location) {
    return !!userId;
  },
  update: function(userId, location, fields, modifier) {
  	//TODO: deny attempts to modify geo-location
    return !!userId;
  },
  remove: function(userId, location) {
    return !!userId;
  }
});

if (Meteor.isServer) {
  Locations._ensureIndex({'locations.loc.coordinates':'2dsphere'});
};

