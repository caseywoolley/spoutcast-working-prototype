'use strict'

angular.module('spoutCastApp')
.directive('reviewCard', function($state) {
  return {
  	//transclude: 'element',
    restrict: 'AE',
    scope: {
    	review: '=',
    	'video': '=',
    	'poster': '=',
      'remove': '='
    },
    templateUrl: 'client/components/review-card/review-card.view.ng.html',
    controller: function ($scope, $element) {
      var user = Meteor.users.findOne({_id: $scope.review.user_id});
      $scope.location = Locations.findOne({_id: $scope.review.location_id});
      
      $scope.avatar = Avatar.getUrl(user);
      if (user.profile){
        $scope.username = user.profile.name;
      }

      $scope.canEdit = Meteor.userId() === user._id;

      //TODO: import different versions by view
      $scope.userMore = function(){
        $state.go('tabs.user-reviews', {id: user._id});
      };

      $scope.locationMore = function() {
        $state.go('tabs.location-reviews', {id: $scope.location._id});
      };

      $scope.editReview = function(review) {
        $state.go('tabs.review-detail', {id: review._id});
      };
    }
  };
});