'use strict';

angular.module('spoutCastApp')
.controller('MapCtrl', function($scope) {

  $scope.viewName = 'Map';

  $scope.helpers({
    spouts: function() {
      return Spouts.find({});
    }
  });
                  
  $scope.subscribe('spouts', function() {
    return [{}, $scope.getReactively('search')];
  });


  $scope.map = {
  	center: {
  		latitude: 30,
  		longitude: -94
  	},
  	zoom: 10,
  	onClicked: function(){ console.log('clicked');}
  };
  console.log($scope.spouts)
  // console.log($scope.currentLocation)
});