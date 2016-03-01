'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('main', {
    url: '/main',
    templateUrl: 'client/main/main.view.ng.html',
    controller: 'MainCtrl'
  });
});