'use strict';

angular.module('spoutCastApp')
.controller('MapCtrl', function($scope, MapService) {

  $scope.helpers({
    locations: function() {
      return Locations.find({});
    }
  });
                  
  $scope.subscribe('locations', function() {
    return [{}, $scope.getReactively('search')];
  });

  MapService.updateLocation();
  $scope.map = MapService.map;
  _.each($scope.locations, function(location){
    location.options = {
      labelClass:'marker_labels',
      labelAnchor:'20 65',
      labelContent: location.name
    };
  });


  // console.log('locations',$scope.locations)
  // console.log($scope.currentLocation)
});