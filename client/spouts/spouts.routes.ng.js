'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('spouts-list', {
    url: '/spouts',
    templateUrl: 'client/spouts/spouts-list.view.ng.html',
    controller: 'SpoutsListCtrl'
  })
  .state('spout-detail', {
    url: '/spouts/:spoutId',
    templateUrl: 'client/spouts/spout-detail.view.ng.html',
    controller: 'SpoutDetailCtrl'
  });
});