'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  // .state('locations-list', {
  //   url: '/locations',
  //   templateUrl: 'client/locations/locations-list.view.ng.html',
  //   controller: 'LocationsListCtrl'
  // })
  .state('tabs.locations-list', {
    url: '/locations',
    views: {
      'tabs': {
        templateUrl: 'client/locations/locations-list.view.ng.html',
        controller : 'LocationsListCtrl'
      }
    }
  })
  // .state('location-detail', {
  //   url: '/locations/:id',
  //   templateUrl: 'client/locations/location-detail.view.ng.html',
  //   controller: 'LocationDetailCtrl'
  // })
  .state('tabs.location-detail', {
    url: '/locations/:id',
    views: {
      'tabs': {
        templateUrl: 'client/locations/location-detail.view.ng.html',
        controller : 'LocationDetailCtrl'
      }
    }
  });
});