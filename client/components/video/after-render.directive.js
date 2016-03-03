'use strict'

//http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded
angular.module('spoutCastApp')
.directive('afterRender', function ($timeout) {
        var def = {
            restrict: 'A',
            terminal: true,
            transclude: false,
            link: function (scope, element, attrs) {
                $timeout(scope.$eval(attrs.afterRender), 0);  //Calling a scoped method
            }
        };
        return def;
    });