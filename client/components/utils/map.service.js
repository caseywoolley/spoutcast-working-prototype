'use strict'

angular.module('spoutCastApp')
.service('MapService', function($state) {

  var geocoder = new google.maps.Geocoder;
  var latLng = {lat: 0, lng: 0};
  var reviewRadius = 1609; //1 mile in meters

  //google map
  var map = {
    center: {
      latitude: latLng.lat,
      longitude: latLng.lng
    },
    zoom: 14,
    circle: {
      radius: reviewRadius,
      center: {
        latitude: latLng.lat,
        longitude: latLng.lng
      }
    },
    markerEvents: {
      click: function(location){ 
        $state.go('tabs.location-reviews', {id: location.model._id});
      }
    }
  };

  var updateLocation = function() {
    latLng = Geolocation.latLng() || latLng;
    Session.set('latLng', latLng);
    reverseGeo();
    map.center.latitude = latLng.lat;
    map.center.longitude = latLng.lng;
    map.circle.center.latitude = latLng.lat;
    map.circle.center.longitude = latLng.lng;
    return latLng;
  };

  // var gPlaces = function(callback) {
  //   var Places = new google.maps.places.PlacesService(map);
  //   Places.nearbySearch(request, function(results, status) {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       for (var i = 0; i < results.length; i++) {
  //         var place = results[i];
  //         // If the request succeeds, draw the place location on
  //         // the map as a marker, and register an event to handle a
  //         // click on the marker.
  //         var marker = new google.maps.Marker({
  //           map: map,
  //           position: place.geometry.location
  //         });
  //       }
  //     }
  //   });
  // };

  var reverseGeo = function(callback) {
    geocoder.geocode( {'latLng': latLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var loc = results[0];
        var location = {
          latLng: {
            lat: loc.geometry.location.lat(),
            lng: loc.geometry.location.lng()
          },
          formatted_address: loc.formatted_address,
          address_components: loc.address_components,
          place_id: loc.place_id
        };
        
        // Session.set('address', loc.formatted_address);
        Session.set('location', location);
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