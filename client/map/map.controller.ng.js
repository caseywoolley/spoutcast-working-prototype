'use strict';

angular.module('spoutCastApp')
.controller('MapCtrl', function($scope) {

  $scope.viewName = 'Map';
	// $reactive(this).attach($scope);

	//this.location = Geolocation.latLng();

  // $scope.location = function() { return Geolocation.latLng(); };

  // $scope.helpers({
  //   currentLocation: function() {
  //     return this.getReactively('location');
  //   }
  // });
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