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
 })
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
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