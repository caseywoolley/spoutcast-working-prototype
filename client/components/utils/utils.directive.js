'use strict'

angular.module('spoutCastApp')
.directive('lowercase', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function(input) {
        return input ? input.toLowerCase() : "";
      });
      element.css("text-transform", "lowercase");
    }
  };
})
//convert html input values to integers
.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, ele, attr, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        return parseInt(viewValue, 10);
      });
    }
  };
})

.directive('autoSelect', function($timeout) {
    return {
      link: function(scope, element, attrs, modelCtrl) {
        $timeout(function(){
          element[0].focus();
        },0);
      }
    };
  })

.filter('timeSince', function() {
  return function(timeStamp) {
    var now = new Date();
    timeStamp = new Date(timeStamp);
    var secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if (secondsPast < 60) {
      return parseInt(secondsPast) + 's ago';
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + 'm ago';
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + 'h ago';
    }
    if (secondsPast > 86400) {
      var day = timeStamp.getDate();
      var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
      var year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
      return day + " " + month + year;
    }
  };
});