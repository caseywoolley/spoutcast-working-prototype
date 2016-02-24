'use strict'

angular.module('spoutCastApp')
.directive('playToggle', function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
    	var vid = el[0];
      var swiping = false;
      var touchStarted = false;
      el.bind('touchstart mousedown', function() {
        touchStarted = true;
      });

      el.bind('touchend mouseup touchcancel', function(){
        if (vid.paused && !swiping){
          vid.play();
        } else if (!swiping) {
          vid.pause();
        }
        touchStarted = false;
        swiping = false;
      });

      el.bind('touchmove mousemove', function(){
        if (touchStarted){
          swiping = true;
        }
      });
    }

  };
});