'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.map', {
    url: '/map',
    views: {
      'tabs': {
        templateUrl: 'client/map/map.view.ng.html',
        controller : 'MapCtrl'
      }
    }
  });
});