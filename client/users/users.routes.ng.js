'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
    .state('tabs.user-reviews', {
    url: '/user/:id',
    views: {
      'tabs': {
        templateUrl: 'client/users/user-reviews.view.ng.html',
        controller : 'UserReviewsCtrl'
      }
    }
  });
});