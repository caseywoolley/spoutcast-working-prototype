Meteor.users.allow({
  insert: function(userId, location) {
    return !!userId;
  },
  update: function(userId, location, fields, modifier) {
    return !!userId;
  },
  remove: function(userId, location) {
    return userId === Meteor.userId();
  }
});