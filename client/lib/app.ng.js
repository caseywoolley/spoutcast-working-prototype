angular.module('spoutCastApp', [
  'angular-meteor',
  'ionic',
  'accounts.ui',
  'ngSanitize',
  'uiGmapgoogle-maps',
  'google.places',
  'ngCordova'
])

.config(function($sceDelegateProvider) {
 	$sceDelegateProvider.resourceUrlWhitelist([
   'self',
   'https://spoutcast-contentdelivery-mobilehub-1722871942.s3.amazonaws.com/**'
  ]);
 });

onReady = function() {
  angular.bootstrap(document, ['spoutCastApp']);
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
  angular.module('spoutCastApp')
  .run(function() {
    FastClick.attach(document.body);
  });
} else {
  angular.element(document).ready(onReady);
}