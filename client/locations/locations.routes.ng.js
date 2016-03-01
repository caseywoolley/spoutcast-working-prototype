'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('locations-list', {
    url: '/locations',
    templateUrl: 'client/locations/locations-list.view.ng.html',
    controller: 'LocationsListCtrl'
  })
  .state('location-detail', {
    url: '/locations/:locationId',
    templateUrl: 'client/locations/location-detail.view.ng.html',
    controller: 'LocationDetailCtrl'
  });
});