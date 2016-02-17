angular.module('spoutCastApp', [
  'angular-meteor',
  'ionic',
  'accounts.ui',
  'ngSanitize',
	'com.2fdevs.videogular'
]);

onReady = function() {
  angular.bootstrap(document, ['spoutCastApp']);
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}