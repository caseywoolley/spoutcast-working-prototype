'use strict';

angular.module('spoutCastApp')
.controller('MapCtrl', function($scope, MapService) {

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
    MapService.updateLocation();
    $scope.map = MapService.map;
    _.each($scope.locations, function(location){
      location.coords = {};
      location.coords.latitude = location.latLng.lat;
      location.coords.longitude = location.latLng.lng;
    });
  });

  console.log('locations',$scope.locations)
  // console.log($scope.currentLocation)
});