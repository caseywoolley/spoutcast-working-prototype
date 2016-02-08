angular.module('spoutCastApp', [
  'angular-meteor',
  'ionic',
  'accounts.ui'
]);

onReady = function() {
  angular.bootstrap(document, ['spoutCastApp']);
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}