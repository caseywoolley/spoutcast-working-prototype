'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('spouts-list', {
    url: '/',
    templateUrl: 'client/spouts/spouts-list.view.ng.html',
    controller: 'SpoutsListCtrl'
  })
  .state('spout-record', {
    url: '/record',
    templateUrl: 'client/spouts/spout-record.view.ng.html',
    controller: 'SpoutRecordCtrl'
  })
  .state('spout-detail', {
    url: '/spouts/:spoutId',
    templateUrl: 'client/spouts/spout-detail.view.ng.html',
    controller: 'SpoutDetailCtrl'
  });
});