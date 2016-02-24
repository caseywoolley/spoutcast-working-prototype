'use strict'

angular.module('spoutCastApp')
.factory('GeoService', function() {

  
    var currentLocation = function() { 
        getLocation(Geolocation.latLng(), function(location){
            Session.set('location', location);
            return location;
        });
      };

      var address = function(){
        if (Session.get('location')){
          return Session.get('location').address;
        }
      };

    var getLocation = function(coords, callback) {
      // coords =  coords || { lat: 0, lng: 0 };
      if (coords) {
        reverseGeocode.getLocation(coords.lat, coords.lng, function(data){
          //Session.set('location', reverseGeocode.getAddrObj());
          if (data.status === "OK"){
            var loc = data.results[0];
            var location = {
              latitude: loc.geometry.location.lat,
              longitude: loc.geometry.location.lng,
              address: loc.formatted_address,
              address_components: loc.address_components,
            };
            console.log(data)
            return callback(location);
          } else {
            return callback(data.status);
          }
        });
      }
    };

    return {
      currentLocation: currentLocation,
      address: address,
      getLocation: getLocation
  };
});