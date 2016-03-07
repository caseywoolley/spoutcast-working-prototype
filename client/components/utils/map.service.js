'use strict'

angular.module('spoutCastApp')
.factory('MapService', function() {
    var geocoder = new google.maps.Geocoder();

    var reverseGeo = function(latLng, callback) {
    if (latLng) {
    geocoder.geocode( {'latLng': latLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var loc = results[0];
        var location = {
          latitude: loc.geometry.location.lat,
          longitude: loc.geometry.location.lng,
          address: loc.formatted_address,
          address_components: loc.address_components,
        };
        
        Session.set('location', loc.formatted_address);
        return callback(location);
        // map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        // map: map,
        // position: results[0].geometry.location
        // });
        }
      });
    }
  };

  return {
    reverseGeo: reverseGeo
  };
});