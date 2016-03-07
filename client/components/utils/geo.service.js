'use strict'

angular.module('spoutCastApp')
.factory('GeoService', function() {
    var geocoder = new google.maps.Geocoder();

    var reverseGeo = function(latLng, callback) {
    if (latLng) {
    geocoder.geocode( {'latLng': latLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results)
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

    var getAddress = function(coords, callback) {
      if (coords) {
        reverseGeocode.getLocation(coords.lat, coords.lng, function(data){
          if (data.status === "OK"){
            var loc = data.results[0];
            var location = {
              latitude: loc.geometry.location.lat,
              longitude: loc.geometry.location.lng,
              address: loc.formatted_address,
              address_components: loc.address_components,
            };
            console.log(data)
            Session.set('location', reverseGeocode.getAddrStr());
            return callback(location);
          } else {
            return callback(data.status);
          }
        });
      }
    };

    return {
      getAddress: getAddress,
      reverseGeo: reverseGeo
    };
})
.directive('searchBar', [
    () => {
    return {
        scope: {
            ngModel: '='
        },
        require: ['?ngModel'],
        restrict: 'E',
        replace: true,
        template: `<div class="item item-input-inset">
                        <label class="item-input-wrapper">
                            <i class="icon ion-ios-search-strong placeholder-icon"></i>
                            <input type="search"
                                   placeholder="Search"
                                   ng-model="ngModel.text">

                            <a ng-if="ngModel.text != ''"
                               on-touch="ngModel.text=''">

                                <i class="icon ion-ios-close placeholder-icon"></i>
                            </a>
                        </label>
                    </div>
                    `,

        link: (scope, element, attrs)=>{

        }
    };
}])