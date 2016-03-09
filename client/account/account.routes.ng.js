'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('account', {
    url: '/account',
    templateUrl: 'client/account/account.view.ng.html',
    controller: 'AccountCtrl',
    resolve: {
      currentUser: ['$meteor', function($meteor) {
        return $meteor.requireUser();
      }]
    }
  })
  .state('login', {
      url: '/login',
      templateUrl: 'client/account/login.view.ng.html',
      controller: 'LoginCtrl'
  });
});