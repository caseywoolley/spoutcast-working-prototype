'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.reviews-list', {
    url: '/reviews',
    views: {
      'tabs': {
        templateUrl: 'client/reviews/reviews-list.view.ng.html',
        controller : 'ReviewsListCtrl'
      }
    }
  })
  .state('tabs.review-detail', {
    url: '/reviews/:id',
    views: {
      'tabs': {
        templateUrl: 'client/reviews/review-detail.view.ng.html',
        controller : 'ReviewDetailCtrl'
      }
    }
  });
});