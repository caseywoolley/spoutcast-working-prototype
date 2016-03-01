Meteor.startup(function() {
  if(Locations.find().count() === 0) {
    var locations = [
      {
        'name': 'location 1'
      },
      {
        'name': 'location 2'
      }
    ];
    locations.forEach(function(location) {
      Locations.insert(location);
    });
  }
});