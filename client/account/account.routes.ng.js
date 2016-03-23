'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.account', {
    url: '/account',
    views: {
      'tabs': {
        templateUrl: 'client/account/account.view.ng.html',
        controller : 'AccountCtrl',
        resolve: {
          currentUser: function($meteor) {
            return $meteor.requireUser();
          }
        }
      }
    }
  })
  .state('tabs.login', {
    url: '/login',
    views: {
      'tabs': {
        templateUrl: 'client/account/login.view.ng.html',
        controller : 'LoginCtrl'
      }
    }
  });
});