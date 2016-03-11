'use strict'

angular.module('spoutCastApp')
.controller('LoginCtrl', function($scope, $meteor, RoutingService) {

	$scope.facebookLogin = function() {
		$meteor.loginWithFacebook().then(function(){
  		console.log('Login success');
  		RoutingService.goBack();
	  }, function(err){
	  	//TODO: display error
	    console.log('Login error - ', err);
	  });
	};

	$scope.googleLogin = function() {
		$meteor.loginWithGoogle().then(function(){
  		console.log('Login success');
  		RoutingService.goBack();
	  }, function(err){
	  	//TODO: display error
	    console.log('Login error - ', err);
	  });
	};

	$scope.twitterLogin = function() {
		$meteor.loginWithTwitter().then(function(){
  		console.log('Login success');
  		RoutingService.goBack();
	  }, function(err){
	  	//TODO: display error
	    console.log('Login error - ', err);
	  });
	};

	console.log(Meteor.absoluteUrl())


});