Meteor.startup(function() {
  if(Reviews.find().count() === 0) {
    var reviews = [
      {
        'name': 'review 1'
      },
      {
        'name': 'review 2'
      }
    ];
    reviews.forEach(function(review) {
      Reviews.insert(review);
    });
  }
});

Meteor.methods({
  removeUserReviews: function() {
    Reviews.remove( {user_id: Meteor.userId()} );
  }
});