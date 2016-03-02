'use strict';

angular.module('spoutCastApp')
.controller('MapCtrl', function($scope) {

  $scope.viewName = 'Map';

  $scope.helpers({
    locations: function() {
      return Locations.find({});
    }
  });
                  
  $scope.subscribe('locations', function() {
    return [{}, $scope.getReactively('search')];
  });

  $scope.autorun(function() {
    _.each($scope.locations, function(location){
      location.coords = {};
      location.coords.latitude = location.latLng.lat;
      location.coords.longitude = location.latLng.lng;
    });
  });

  $scope.map = {
  	center: {
  		latitude: 30,
  		longitude: -94
  	},
  	zoom: 10,
  	onClicked: function(){ console.log('clicked');}
  };
  console.log('locations',$scope.locations)
  // console.log($scope.currentLocation)
});