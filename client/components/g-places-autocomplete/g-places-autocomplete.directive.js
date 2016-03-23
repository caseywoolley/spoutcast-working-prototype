'use strict'

angular.module('spoutCastApp')
.directive('gPlaces', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
        	console.log(element[0])
        	var autocomplete = new google.maps.places.Autocomplete(element[0]);
        }
    };
});