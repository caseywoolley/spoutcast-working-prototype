'use strict'

angular.module('spoutCastApp')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs', {
    url : '/tabs',
    templateUrl : 'client/components/nav/tabs.view.ng.html',
    abstract : true
  });
});