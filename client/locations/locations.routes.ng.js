'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.locations-list', {
    url: '/locations',
    views: {
      'tabs': {
        templateUrl: 'client/locations/locations-list.view.ng.html',
        controller : 'LocationsListCtrl'
      }
    }
  })
  .state('tabs.location-detail', {
    url: '/locations/:id',
    views: {
      'tabs': {
        templateUrl: 'client/locations/location-detail.view.ng.html',
        controller : 'LocationDetailCtrl',
        resolve: {
          currentUser: function($meteor) {
            return $meteor.requireUser();
          }
        }
      }
    }
  })
   .state('tabs.location-reviews', {
    url: '/location/:id/reviews',
    views: {
      'tabs': {
        templateUrl: 'client/locations/location-reviews.view.ng.html',
        controller : 'LocationReviewsCtrl'
      }
    }
  });
});