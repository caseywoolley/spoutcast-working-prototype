'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('reviews-list', {
    url: '/',
    templateUrl: 'client/reviews/reviews-list.view.ng.html',
    controller: 'ReviewsListCtrl'
  })
  .state('review-detail', {
    url: '/reviews/:id',
    templateUrl: 'client/reviews/review-detail.view.ng.html',
    controller: 'ReviewDetailCtrl'
  })
  .state('review-add', {
    url: '/add-review',
    templateUrl: 'client/reviews/review-add.view.ng.html',
    controller: 'ReviewAddCtrl'
  });
});