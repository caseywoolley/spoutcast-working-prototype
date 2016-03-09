'use strict'

angular.module('spoutCastApp')
.controller('LoginCtrl', function($scope, $meteor) {
  
	$scope.login = function() {
		console.log($scope.email, $scope.password)
		$meteor.loginWithPassword( $scope.email, $scope.password ).then(function(){
		  console.log('Login success');
		}, function(err){
		  console.log('Login error - ', err);
		});
	};

	$scope.logout = function() {
		$meteor.logout();
	};

});