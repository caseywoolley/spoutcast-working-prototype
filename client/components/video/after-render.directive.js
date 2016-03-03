'use strict'

//http://gsferreira.com/archive/2015/03/angularjs-after-render-directive/
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