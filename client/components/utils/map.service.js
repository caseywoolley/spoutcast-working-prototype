'use strict'

angular.module('spoutCastApp')
.service('MapService', function($state) {

  var geocoder = new google.maps.Geocoder();
  var latLng = {lat: 0, lng: 0};
  var reviewRadius = 1609; //1 mile in meters

  //google map
  var map = {
    center: {
      latitude: latLng.lat,
      longitude: latLng.lng
    },
    zoom: 10,
    circle: {
      radius: reviewRadius,
      center: {
        latitude: latLng.lat,
        longitude: latLng.lng
      }
    },
    markerEvents: {
      click: function(){ 
        console.log('clicked');
        $state.go('reviews-list');
      }
    }
  };

  var updateLocation = function() {
    latLng = Geolocation.latLng() || latLng;
    reverseGeo(latLng);

    map.center.latitude = latLng.lat;
    map.center.longitude = latLng.lng;

    map.circle.center.latitude = latLng.lat;
    map.circle.center.longitude = latLng.lng;

    return latLng;
  };

  var reverseGeo = function(latLng, callback) {
    geocoder.geocode( {'latLng': latLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var loc = results[0];
        var location = {
          latitude: loc.geometry.location.lat,
          longitude: loc.geometry.location.lng,
          address: loc.formatted_address,
          address_components: loc.address_components,
        };
        
        Session.set('address', loc.formatted_address);
        Session.set('location', loc);
        if (callback){
          return callback(location);
        }         
      }
    });
  };

  return {
    map: map,
    reviewRadius: reviewRadius,
    getCoords: function() { return latLng; },
    updateLocation, updateLocation,
    reverseGeo: reverseGeo
  };
});